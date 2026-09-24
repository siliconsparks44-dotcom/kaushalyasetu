export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return errorResponse('Not authenticated', 'UNAUTHORIZED', 401);
    }

    const unreadNotificationsCount = await prisma.notification.count({
      where: {
        OR: [
          { userId: user.id, isRead: false },
          { role: user.role, isRead: false },
        ],
      },
    });

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
        employerProfile: user.employerProfile,
        instituteProfile: user.instituteProfile,
        trainerProfile: user.trainerProfile,
        studentProfile: user.studentProfile,
      },
      unreadNotificationsCount,
    });
  } catch (err: any) {
    console.error('Me endpoint error:', err);
    return errorResponse('Failed to fetch user', 'SERVER_ERROR', 500);
  }
}
