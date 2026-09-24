export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reviewNotes: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTITUTE' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized: Human approval requires Institute or Admin role', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Invalid decision payload', 'VALIDATION_ERROR', 400);
    }

    const rec = await prisma.curriculumRecommendation.findUnique({
      where: { id: params.id },
      include: { course: true, skill: true },
    });

    if (!rec) {
      return errorResponse('Recommendation not found', 'NOT_FOUND', 404);
    }

    const updated = await prisma.curriculumRecommendation.update({
      where: { id: params.id },
      data: {
        status: parsed.data.status,
        reviewedBy: `${user.fullName} (${user.role})`,
        reviewNotes: parsed.data.reviewNotes || `Decision recorded by ${user.fullName}`,
        reviewedAt: new Date(),
      },
    });

    // If APPROVED and action is ADD and skill exists, add to course skills
    if (parsed.data.status === 'APPROVED' && rec.actionType === 'ADD' && rec.skillId) {
      const existing = await prisma.courseSkill.findUnique({
        where: {
          courseId_skillId: {
            courseId: rec.courseId,
            skillId: rec.skillId,
          },
        },
      });

      if (!existing) {
        await prisma.courseSkill.create({
          data: {
            courseId: rec.courseId,
            skillId: rec.skillId,
            proficiency: 'intermediate',
            theoryHours: 15,
            practicalHours: 30,
          },
        });
      }

      // Add a new Curriculum Version incrementing version number
      const currentCurr = await prisma.curriculum.findFirst({
        where: { courseId: rec.courseId },
      });

      if (currentCurr) {
        const nextVersion = `v${(parseFloat(currentCurr.currentVersion.replace('v', '')) + 0.1).toFixed(1)}`;
        await prisma.curriculum.update({
          where: { id: currentCurr.id },
          data: { currentVersion: nextVersion },
        });

        await prisma.curriculumVersion.create({
          data: {
            curriculumId: currentCurr.id,
            versionNumber: nextVersion,
            changeSummary: `Human-approved recommendation applied: Added competency in '${rec.skill?.name || 'emerging skill'}'. Note: ${parsed.data.reviewNotes || 'Approved'}`,
            approvedBy: user.fullName,
            status: 'ACTIVE',
          },
        });
      }
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `RECOMMENDATION_${parsed.data.status}`,
        entityType: 'CURRICULUM_RECOMMENDATION',
        entityId: rec.id,
        detailsJson: JSON.stringify({
          courseCode: rec.course.code,
          actionType: rec.actionType,
          status: parsed.data.status,
          decisionNotes: parsed.data.reviewNotes,
        }),
      },
    });

    return successResponse(updated);
  } catch (err: any) {
    console.error('Curriculum approval error:', err);
    return errorResponse('Failed to update recommendation', 'SERVER_ERROR', 500);
  }
}
