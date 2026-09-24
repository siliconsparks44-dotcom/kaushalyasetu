export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return errorResponse('Only administrators can view audit logs', 'FORBIDDEN', 403);
    }

    const logs = await prisma.auditLog.findMany({
      include: {
        user: { select: { email: true, fullName: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse(logs);
  } catch (err: any) {
    return errorResponse('Failed to fetch audit logs', 'SERVER_ERROR', 500);
  }
}
