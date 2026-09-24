export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        employer: true,
        sector: true,
        district: true,
        jobSkills: { include: { skill: true } },
      },
    });

    if (!job) {
      return errorResponse('Job not found', 'NOT_FOUND', 404);
    }

    return successResponse(job);
  } catch (err: any) {
    return errorResponse('Failed to fetch job', 'SERVER_ERROR', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'EMPLOYER' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized to update job', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: body.title,
        location: body.location,
        description: body.description,
        status: body.status,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        openings: body.openings,
      },
    });

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('Failed to update job', 'SERVER_ERROR', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'EMPLOYER' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized to delete job', 'FORBIDDEN', 403);
    }

    await prisma.job.update({
      where: { id: params.id },
      data: { status: 'CLOSED' },
    });

    return successResponse({ message: 'Job closed successfully' });
  } catch (err: any) {
    return errorResponse('Failed to delete job', 'SERVER_ERROR', 500);
  }
}
