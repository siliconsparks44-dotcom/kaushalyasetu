export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        institute: true,
        sector: true,
        district: true,
        courseSkills: { include: { skill: true } },
        modules: { orderBy: { orderIndex: 'asc' } },
        curriculums: {
          include: { versions: { orderBy: { createdAt: 'desc' } } },
        },
        recommendations: {
          include: { skill: true },
          orderBy: { createdAt: 'desc' },
        },
        equipment: true,
        placements: true,
      },
    });

    if (!course) {
      return errorResponse('Course not found', 'NOT_FOUND', 404);
    }

    return successResponse(course);
  } catch (err: any) {
    return errorResponse('Failed to fetch course', 'SERVER_ERROR', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTITUTE' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized to update course', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const updated = await prisma.course.update({
      where: { id: params.id },
      data: {
        title: body.title,
        qualification: body.qualification,
        durationWeeks: body.durationWeeks,
        capacity: body.capacity,
        description: body.description,
        status: body.status,
      },
    });

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('Failed to update course', 'SERVER_ERROR', 500);
  }
}
