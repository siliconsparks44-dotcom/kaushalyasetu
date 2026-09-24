export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const placementSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  employerName: z.string().min(2),
  role: z.string().min(2),
  salary: z.number().min(10000).default(300000),
  location: z.string().min(2),
  employmentType: z.string().default('FULL_TIME'),
  skillsUsed: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const placements = await prisma.placement.findMany({
      include: {
        student: { select: { fullName: true, educationLevel: true } },
        course: { select: { title: true, code: true } },
        feedback: true,
      },
      orderBy: { placementDate: 'desc' },
    });

    const total = placements.length;
    const avgSalary = total > 0 ? Math.round(placements.reduce((acc, p) => acc + p.salary, 0) / total) : 0;

    return successResponse({
      total,
      averageSalary: avgSalary,
      placements,
    });
  } catch (err: any) {
    return errorResponse('Failed to fetch placements', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTITUTE' && user.role !== 'ADMIN')) {
      return errorResponse('Only institutes or administrators can record placements', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const parsed = placementSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400);
    }

    const record = await prisma.placement.create({
      data: parsed.data,
    });

    return successResponse(record, undefined, 201);
  } catch (err: any) {
    return errorResponse('Failed to record placement', 'SERVER_ERROR', 500);
  }
}
