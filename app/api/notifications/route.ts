export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId: user.id },
          { role: user.role },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return successResponse(notifications);
  } catch (err: any) {
    return errorResponse('Failed to fetch notifications', 'SERVER_ERROR', 500);
  }
}
