export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const states = await prisma.state.findMany({
      include: {
        districts: {
          include: {
            _count: {
              select: {
                jobs: true,
                courses: true,
                institutes: true,
              },
            },
          },
        },
      },
    });

    return successResponse(states);
  } catch (err: any) {
    return errorResponse('Failed to fetch districts', 'SERVER_ERROR', 500);
  }
}
