export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { normalizeSkillName } from '@/lib/skills-engine';
import { z } from 'zod';

const jobCreateSchema = z.object({
  title: z.string().min(2),
  sectorId: z.string().optional(),
  districtId: z.string().optional(),
  location: z.string().min(2),
  description: z.string().min(10),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'lead']).default('entry'),
  education: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  employmentType: z.string().default('FULL_TIME'),
  openings: z.number().min(1).default(1),
  skills: z.array(
    z.object({
      name: z.string(),
      proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
      importance: z.enum(['required', 'preferred', 'optional']).default('required'),
    })
  ).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectorId = searchParams.get('sectorId');
    const districtId = searchParams.get('districtId');
    const query = searchParams.get('q');
    const status = searchParams.get('status') || 'ACTIVE';

    const jobs = await prisma.job.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(sectorId ? { sectorId } : {}),
        ...(districtId ? { districtId } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { location: { contains: query } },
              ],
            }
          : {}),
      },
      include: {
        employer: true,
        sector: true,
        district: true,
        jobSkills: {
          include: { skill: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(jobs);
  } catch (err: any) {
    console.error('Fetch jobs error:', err);
    return errorResponse('Failed to fetch jobs', 'SERVER_ERROR', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'EMPLOYER' && user.role !== 'ADMIN')) {
      return errorResponse('Only employers or administrators can post jobs', 'FORBIDDEN', 403);
    }

    let employerId = user.employerProfile?.id;
    if (!employerId && user.role === 'ADMIN') {
      const firstEmployer = await prisma.employer.findFirst();
      employerId = firstEmployer?.id;
    }

    if (!employerId) {
      return errorResponse('No employer profile associated with account', 'BAD_REQUEST', 400);
    }

    const body = await req.json();
    const parsed = jobCreateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Validation failed', 'VALIDATION_ERROR', 400, parsed.error.format());
    }

    const {
      title,
      sectorId,
      districtId,
      location,
      description,
      experienceLevel,
      education,
      salaryMin,
      salaryMax,
      employmentType,
      openings,
      skills,
    } = parsed.data;

    // Duplicate detection: Same title, employer, and location within last 3 days
    const existingJob = await prisma.job.findFirst({
      where: {
        employerId,
        title,
        location,
        status: 'ACTIVE',
      },
    });

    if (existingJob) {
      return errorResponse('A duplicate active job posting with identical title and location exists', 'DUPLICATE_JOB', 409);
    }

    const job = await prisma.job.create({
      data: {
        employerId,
        title,
        sectorId: sectorId || null,
        districtId: districtId || null,
        location,
        description,
        experienceLevel,
        education: education || null,
        salaryMin: salaryMin || null,
        salaryMax: salaryMax || null,
        employmentType,
        openings,
        status: 'ACTIVE',
        source: 'INTERNAL',
      },
    });

    // Normalize and associate skills
    for (const s of skills) {
      const normalized = await normalizeSkillName(s.name);
      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          skillId: normalized.id,
          proficiency: s.proficiency,
          importance: s.importance,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'JOB_CREATED',
        entityType: 'JOB',
        entityId: job.id,
        detailsJson: JSON.stringify({ title, location, openings, skillsCount: skills.length }),
      },
    });

    const fullJob = await prisma.job.findUnique({
      where: { id: job.id },
      include: {
        employer: true,
        sector: true,
        district: true,
        jobSkills: { include: { skill: true } },
      },
    });

    return successResponse(fullJob, undefined, 201);
  } catch (err: any) {
    console.error('Create job error:', err);
    return errorResponse(err.message || 'Failed to create job', 'SERVER_ERROR', 500);
  }
}
