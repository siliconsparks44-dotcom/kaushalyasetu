export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const trends = await prisma.technologyTrend.findMany({
      include: { sector: true },
      orderBy: { growthRatePercent: 'desc' },
    });

    return successResponse(trends);
  } catch (err: any) {
    return errorResponse('Failed to fetch technology trends', 'SERVER_ERROR', 500);
  }
}
