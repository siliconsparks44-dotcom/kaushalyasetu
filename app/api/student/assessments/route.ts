export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        skill: true,
        questions: true,
      },
    });

    return successResponse(assessments);
  } catch (err: any) {
    return errorResponse('Failed to fetch assessments', 'SERVER_ERROR', 500);
  }
}
