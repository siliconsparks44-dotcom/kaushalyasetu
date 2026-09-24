export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('General Technical'),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  technology: z.string().optional(),
  sector: z.string().optional(),
  status: z.enum(['ACTIVE', 'DEPRECATED', 'EMERGING']).default('ACTIVE'),
  aliases: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const status = searchParams.get('status');

    const skills = await prisma.skill.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(status ? { status } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query } },
                { description: { contains: query } },
                { aliases: { some: { alias: { contains: query.toLowerCase() } } } },
              ],
            }
          : {}),
      },
      include: {
        aliases: true,
        _count: {
          select: {
            jobSkills: true,
            courseSkills: true,
            trainerSkills: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(skills);
  } catch (err: any) {
    console.error('Fetch skills error:', err);
    return errorResponse('Failed to fetch skills', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Only administrators can manage the skill taxonomy', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Invalid skill data', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const { name, category, subcategory, description, technology, sector, status, aliases } = parsed.data;

    const existing = await prisma.skill.findUnique({ where: { name } });
    if (existing) {
      return errorResponse(`Skill '${name}' already exists in taxonomy`, 'CONFLICT', 409);
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        subcategory,
        description,
        technology,
        sector,
        status,
      },
    });

    for (const alias of aliases) {
      await prisma.skillAlias.create({
        data: {
          alias: alias.toLowerCase(),
          skillId: skill.id,
        },
      });
    }

    return successResponse(skill, undefined, 201);
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create skill', 'SERVER_ERROR', 500);
  }
}
