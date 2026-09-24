export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const feedbackSchema = z.object({
  placementId: z.string(),
  candidateJobReady: z.boolean().default(true),
  technicalSkillRating: z.number().min(1).max(5).default(4),
  softSkillRating: z.number().min(1).max(5).default(4),
  productivityRating: z.number().min(1).max(5).default(4),
  trainingRelevanceRating: z.number().min(1).max(5).default(4),
  curriculumFeedback: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const feedbacks = await prisma.employerFeedback.findMany({
      include: {
        placement: {
          include: {
            course: true,
            student: true,
          },
        },
        employer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(feedbacks);
  } catch (err: any) {
    return errorResponse('Failed to fetch employer feedback', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'EMPLOYER' && user.role !== 'ADMIN')) {
      return errorResponse('Only employers can submit candidate feedback', 'FORBIDDEN', 403);
    }

    let employerId = user.employerProfile?.id;
    if (!employerId && user.role === 'ADMIN') {
      const firstEmp = await prisma.employer.findFirst();
      employerId = firstEmp?.id;
    }

    if (!employerId) {
      return errorResponse('No employer profile linked to user', 'BAD_REQUEST', 400);
    }

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400);
    }

    const fb = await prisma.employerFeedback.create({
      data: {
        ...parsed.data,
        employerId,
      },
    });

    return successResponse(fb, undefined, 201);
  } catch (err: any) {
    return errorResponse('Failed to submit employer feedback', 'SERVER_ERROR', 500);
  }
}
