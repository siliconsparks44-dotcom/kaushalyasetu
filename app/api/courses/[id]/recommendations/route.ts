export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { getAIProvider } from '@/ai';
import { successResponse, errorResponse } from '@/lib/response';
import { calculateCourseAlignment } from '@/lib/skills-engine';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTITUTE' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized to generate recommendations', 'FORBIDDEN', 403);
    }

    const alignment = await calculateCourseAlignment(params.id);
    const ai = getAIProvider();

    const indDemandList = alignment.missingSkills.map((m) => ({
      name: m.name,
      count: m.count,
      growthPct: 28,
    }));

    const aiRecommendations = await ai.generateCurriculumRecommendations(
      alignment.course.title,
      alignment.courseSkills,
      indDemandList
    );

    // Save recommendations into DB with status PENDING for human review
    const createdRecs = [];
    for (const rec of aiRecommendations) {
      // Find skill id if exists
      const skill = await prisma.skill.findFirst({
        where: { name: { equals: rec.skillName } },
      });

      const dbRec = await prisma.curriculumRecommendation.create({
        data: {
          courseId: params.id,
          actionType: rec.actionType,
          skillId: skill?.id || null,
          affectedModule: rec.affectedModule || 'General Module',
          reason: rec.reason,
          supportingData: JSON.stringify(rec.supportingData),
          confidence: rec.confidence,
          source: `${ai.name} Automated Market Intelligence`,
          status: 'PENDING',
        },
      });
      createdRecs.push(dbRec);
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CURRICULUM_RECOMMENDATIONS_GENERATED',
        entityType: 'COURSE',
        entityId: params.id,
        detailsJson: JSON.stringify({ count: createdRecs.length, provider: ai.name }),
      },
    });

    return successResponse({
      recommendations: createdRecs,
      alignment,
      provider: ai.name,
    }, undefined, 201);
  } catch (err: any) {
    console.error('Generate recommendations error:', err);
    return errorResponse(err.message || 'Failed to generate recommendations', 'SERVER_ERROR', 500);
  }
}
