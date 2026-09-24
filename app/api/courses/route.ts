export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { normalizeSkillName } from '@/lib/skills-engine';
import { z } from 'zod';

const courseCreateSchema = z.object({
  title: z.string().min(3),
  code: z.string().min(2),
  sectorId: z.string().optional(),
  districtId: z.string().optional(),
  qualification: z.string().optional(),
  durationWeeks: z.number().min(1).default(12),
  level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  description: z.string().min(10),
  capacity: z.number().min(1).default(60),
  skills: z.array(z.string()).default([]),
  modules: z.array(
    z.object({
      title: z.string().min(2),
      description: z.string().optional(),
      theoryHours: z.number().default(20),
      practicalHours: z.number().default(40),
    })
  ).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectorId = searchParams.get('sectorId');
    const districtId = searchParams.get('districtId');
    const query = searchParams.get('q');

    const courses = await prisma.course.findMany({
      where: {
        ...(sectorId ? { sectorId } : {}),
        ...(districtId ? { districtId } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { code: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {}),
      },
      include: {
        institute: true,
        sector: true,
        district: true,
        courseSkills: { include: { skill: true } },
        modules: { orderBy: { orderIndex: 'asc' } },
        curriculums: {
          include: { versions: true },
        },
        recommendations: {
          where: { status: 'PENDING' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(courses);
  } catch (err: any) {
    console.error('Fetch courses error:', err);
    return errorResponse('Failed to fetch courses', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTITUTE' && user.role !== 'ADMIN')) {
      return errorResponse('Only training institutes or administrators can create courses', 'FORBIDDEN', 403);
    }

    let instituteId = user.instituteProfile?.id;
    if (!instituteId && user.role === 'ADMIN') {
      const firstInst = await prisma.trainingInstitute.findFirst();
      instituteId = firstInst?.id;
    }

    if (!instituteId) {
      return errorResponse('No training institute profile associated with account', 'BAD_REQUEST', 400);
    }

    const body = await req.json();
    const parsed = courseCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const {
      title,
      code,
      sectorId,
      districtId,
      qualification,
      durationWeeks,
      level,
      description,
      capacity,
      skills,
      modules,
    } = parsed.data;

    const existingCode = await prisma.course.findUnique({ where: { code } });
    if (existingCode) {
      return errorResponse(`Course code '${code}' already exists`, 'CONFLICT', 409);
    }

    const course = await prisma.course.create({
      data: {
        instituteId,
        title,
        code,
        sectorId: sectorId || null,
        districtId: districtId || null,
        qualification,
        durationWeeks,
        level,
        description,
        capacity,
        status: 'ACTIVE',
      },
    });

    // Add Modules
    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      await prisma.courseModule.create({
        data: {
          courseId: course.id,
          title: mod.title,
          description: mod.description || '',
          theoryHours: mod.theoryHours,
          practicalHours: mod.practicalHours,
          orderIndex: i + 1,
        },
      });
    }

    // Add Skills
    for (const skillName of skills) {
      const normalized = await normalizeSkillName(skillName);
      await prisma.courseSkill.create({
        data: {
          courseId: course.id,
          skillId: normalized.id,
          proficiency: 'intermediate',
        },
      });
    }

    // Initialize Curriculum v1.0
    const curriculum = await prisma.curriculum.create({
      data: {
        courseId: course.id,
        title: `${title} - Curriculum Framework`,
        currentVersion: 'v1.0',
        status: 'PUBLISHED',
      },
    });

    await prisma.curriculumVersion.create({
      data: {
        curriculumId: curriculum.id,
        versionNumber: 'v1.0',
        changeSummary: 'Initial course curriculum baseline created.',
        approvedBy: user.fullName,
        status: 'ACTIVE',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'COURSE_CREATED',
        entityType: 'COURSE',
        entityId: course.id,
        detailsJson: JSON.stringify({ code, title, capacity }),
      },
    });

    return successResponse(course, undefined, 201);
  } catch (err: any) {
    console.error('Create course error:', err);
    return errorResponse(err.message || 'Failed to create course', 'SERVER_ERROR', 500);
  }
}
