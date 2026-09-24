export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const surveySchema = z.object({
  surveyYear: z.number().default(2026),
  quarter: z.number().min(1).max(4).default(3),
  difficultToHireRoles: z.array(z.string()).or(z.string()),
  emergingTechNeeds: z.array(z.string()).or(z.string()),
  productivityFeedback: z.string().optional(),
  trainingRequirements: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const surveys = await prisma.employerSurvey.findMany({
      include: {
        employer: { select: { companyName: true, industrySector: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(surveys);
  } catch (err: any) {
    return errorResponse('Failed to fetch surveys', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'EMPLOYER' && user.role !== 'ADMIN')) {
      return errorResponse('Only employers or administrators can submit surveys', 'FORBIDDEN', 403);
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
    const parsed = surveySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const { surveyYear, quarter, difficultToHireRoles, emergingTechNeeds, productivityFeedback, trainingRequirements } = parsed.data;

    const survey = await prisma.employerSurvey.create({
      data: {
        employerId,
        surveyYear,
        quarter,
        difficultToHireRoles: typeof difficultToHireRoles === 'string' ? difficultToHireRoles : JSON.stringify(difficultToHireRoles),
        emergingTechNeeds: typeof emergingTechNeeds === 'string' ? emergingTechNeeds : JSON.stringify(emergingTechNeeds),
        productivityFeedback: productivityFeedback || null,
        trainingRequirements: trainingRequirements || null,
        rawResponses: JSON.stringify(body),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'EMPLOYER_SURVEY_SUBMITTED',
        entityType: 'EMPLOYER_SURVEY',
        entityId: survey.id,
        detailsJson: JSON.stringify({ surveyYear, quarter }),
      },
    });

    return successResponse(survey, undefined, 201);
  } catch (err: any) {
    return errorResponse('Failed to submit survey', 'SERVER_ERROR', 500);
  }
}
