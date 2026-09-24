export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const equipmentSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  totalQuantity: z.number().min(1),
  availableQuantity: z.number().min(0),
  conditionStatus: z.enum(['OPERATIONAL', 'MAINTENANCE', 'DEPRECATED']).default('OPERATIONAL'),
  location: z.string().min(2),
  courseId: z.string().optional(),
  requiredSkills: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const equipment = await prisma.equipment.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(status ? { conditionStatus: status } : {}),
      },
      include: {
        course: { select: { title: true, code: true } },
        organization: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(equipment);
  } catch (err: any) {
    return errorResponse('Failed to fetch equipment', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTITUTE' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized to manage equipment', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const parsed = equipmentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const eq = await prisma.equipment.create({
      data: {
        ...parsed.data,
        instituteId: user.organizationId || null,
      },
    });

    return successResponse(eq, undefined, 201);
  } catch (err: any) {
    return errorResponse('Failed to add equipment', 'SERVER_ERROR', 500);
  }
}
