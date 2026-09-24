export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const status = searchParams.get('status');

    const recs = await prisma.curriculumRecommendation.findMany({
      where: {
        ...(courseId ? { courseId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        course: {
          include: {
            institute: true,
            sector: true,
          },
        },
        skill: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(recs);
  } catch (err: any) {
    return errorResponse('Failed to fetch recommendations', 'SERVER_ERROR', 500);
  }
}
