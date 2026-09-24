export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        user: { select: { email: true, fullName: true } },
        organization: true,
        trainerSkills: {
          include: { skill: true },
        },
      },
      orderBy: { fullName: 'asc' },
    });

    return successResponse(trainers);
  } catch (err: any) {
    return errorResponse('Failed to fetch trainers', 'SERVER_ERROR', 500);
  }
}
