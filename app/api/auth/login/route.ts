export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse('Invalid email or password format', 'VALIDATION_ERROR', 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employerProfile: true,
        instituteProfile: true,
        trainerProfile: true,
        studentProfile: true,
        organization: true,
      },
    });

    if (!user) {
      return errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    if (user.accountStatus !== 'ACTIVE') {
      return errorResponse('Account is suspended or pending verification', 'ACCOUNT_RESTRICTED', 403);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      organizationId: user.organizationId,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'USER',
        entityId: user.id,
        detailsJson: JSON.stringify({ role: user.role }),
      },
    });

    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organization: user.organization,
        employerProfile: user.employerProfile,
        instituteProfile: user.instituteProfile,
        trainerProfile: user.trainerProfile,
        studentProfile: user.studentProfile,
      },
      token,
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return errorResponse(err.message || 'Internal server error', 'SERVER_ERROR', 500);
  }
}
