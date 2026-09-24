export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

    let student = user.studentProfile;
    if (!student && user.role === 'ADMIN') {
      student = await prisma.student.findFirst();
    }

    if (!student) {
      return errorResponse('Student profile not found', 'NOT_FOUND', 404);
    }

    const fullProfile = await prisma.student.findUnique({
      where: { id: student.id },
      include: {
        district: true,
        placements: { include: { course: true } },
        results: { include: { assessment: { include: { skill: true } } } },
      },
    });

    return successResponse(fullProfile);
  } catch (err: any) {
    return errorResponse('Failed to fetch student profile', 'SERVER_ERROR', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

    const student = user.studentProfile;
    if (!student) return errorResponse('Student profile not found', 'NOT_FOUND', 404);

    const body = await req.json();
    const updated = await prisma.student.update({
      where: { id: student.id },
      data: {
        fullName: body.fullName || student.fullName,
        educationLevel: body.educationLevel || student.educationLevel,
        location: body.location || student.location,
        districtId: body.districtId || student.districtId,
        bio: body.bio || student.bio,
        extractedSkills: body.skills ? JSON.stringify(body.skills) : student.extractedSkills,
      },
    });

    return successResponse(updated);
  } catch (err: any) {
    return errorResponse('Failed to update student profile', 'SERVER_ERROR', 500);
  }
}
