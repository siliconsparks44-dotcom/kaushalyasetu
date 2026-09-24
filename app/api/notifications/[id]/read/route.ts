export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

    await prisma.notification.update({
      where: { id: params.id },
      data: { isRead: true },
    });

    return successResponse({ message: 'Notification marked as read' });
  } catch (err: any) {
    return errorResponse('Failed to update notification', 'SERVER_ERROR', 500);
  }
}
