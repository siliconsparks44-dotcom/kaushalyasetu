export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const consultationSchema = z.object({
  companyName: z.string().min(2),
  sectorId: z.string().optional(),
  expertName: z.string().min(2),
  consultationDate: z.string().optional(),
  location: z.string().min(2),
  roleEvaluated: z.string().min(2),
  requiredSkills: z.string().min(2),
  emergingTech: z.string().optional(),
  curriculumSuggestions: z.string().optional(),
  equipmentRequirements: z.string().optional(),
  trainerRequirements: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    const consultations = await prisma.industryConsultation.findMany({
      where: {
        ...(query
          ? {
              OR: [
                { companyName: { contains: query } },
                { expertName: { contains: query } },
                { roleEvaluated: { contains: query } },
                { requiredSkills: { contains: query } },
              ],
            }
          : {}),
      },
      include: { sector: true },
      orderBy: { consultationDate: 'desc' },
    });

    return successResponse(consultations);
  } catch (err: any) {
    return errorResponse('Failed to fetch consultations', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Only administrators can record official industry consultations', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const parsed = consultationSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const record = await prisma.industryConsultation.create({
      data: {
        ...parsed.data,
        consultationDate: parsed.data.consultationDate ? new Date(parsed.data.consultationDate) : new Date(),
        conductedBy: user.fullName,
      },
    });

    return successResponse(record, undefined, 201);
  } catch (err: any) {
    return errorResponse('Failed to record consultation', 'SERVER_ERROR', 500);
  }
}
