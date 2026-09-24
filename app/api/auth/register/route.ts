export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum(['ADMIN', 'EMPLOYER', 'INSTITUTE', 'TRAINER', 'STUDENT']),
  organizationName: z.string().optional(),
  districtId: z.string().optional(),
  stateId: z.string().optional(),
  companySector: z.string().optional(),
  instituteType: z.string().optional(),
  qualification: z.string().optional(),
  educationLevel: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const {
      email,
      password,
      fullName,
      role,
      organizationName,
      districtId,
      stateId,
      companySector,
      instituteType,
      qualification,
      educationLevel,
    } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse('A user with this email already exists', 'CONFLICT', 409);
    }

    const passwordHash = await hashPassword(password);

    // Optional organization creation
    let orgId: string | undefined = undefined;
    if (organizationName) {
      const org = await prisma.organization.create({
        data: {
          name: organizationName,
          type: role === 'EMPLOYER' ? 'EMPLOYER' : role === 'INSTITUTE' ? 'INSTITUTE' : 'GOVERNMENT',
          districtId: districtId || null,
          stateId: stateId || null,
        },
      });
      orgId = org.id;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
        organizationId: orgId,
        accountStatus: 'ACTIVE',
      },
    });

    // Create role-specific profile
    if (role === 'EMPLOYER') {
      await prisma.employer.create({
        data: {
          userId: newUser.id,
          organizationId: orgId,
          companyName: organizationName || `${fullName}'s Organization`,
          industrySector: companySector || 'Technology & Engineering',
        },
      });
    } else if (role === 'INSTITUTE') {
      await prisma.trainingInstitute.create({
        data: {
          userId: newUser.id,
          organizationId: orgId,
          instituteName: organizationName || `${fullName}'s Training Institute`,
          code: `INST-${Math.floor(1000 + Math.random() * 9000)}`,
          instituteType: instituteType || 'VOCATIONAL_CENTER',
          districtId: districtId || null,
          stateId: stateId || null,
        },
      });
    } else if (role === 'TRAINER') {
      await prisma.trainer.create({
        data: {
          userId: newUser.id,
          organizationId: orgId,
          fullName,
          qualification: qualification || 'Vocational Instructor',
          location: 'Regional Centre',
        },
      });
    } else if (role === 'STUDENT') {
      await prisma.student.create({
        data: {
          userId: newUser.id,
          fullName,
          educationLevel: educationLevel || 'Vocational Trainee',
          districtId: districtId || null,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: newUser.id,
        action: 'USER_REGISTERED',
        entityType: 'USER',
        entityId: newUser.id,
        detailsJson: JSON.stringify({ email, role, fullName }),
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
      organizationId: newUser.organizationId,
    });

    const response = successResponse(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      },
      undefined,
      201
    );

    // Set HTTP-Only Cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Registration error:', err);
    return errorResponse(err.message || 'Internal server error', 'SERVER_ERROR', 500);
  }
}
