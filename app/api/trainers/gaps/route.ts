export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        trainerSkills: { include: { skill: true } },
        organization: true,
      },
    });

    // High demand skills from active job postings
    const activeJobSkills = await prisma.jobSkill.findMany({
      where: { job: { status: 'ACTIVE' } },
      include: { skill: true },
    });

    const skillCounts: Record<string, { name: string; count: number; category: string }> = {};
    for (const js of activeJobSkills) {
      if (!skillCounts[js.skill.name]) {
        skillCounts[js.skill.name] = { name: js.skill.name, count: 0, category: js.skill.category };
      }
      skillCounts[js.skill.name].count += 1;
    }

    const highDemandSkills = Object.values(skillCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const highDemandSkillNames = highDemandSkills.map((h) => h.name);

    // Compute gaps for each trainer
    const trainerGaps = trainers.map((t) => {
      const ownedSkills = new Set(t.trainerSkills.map((ts) => ts.skill.name));
      const missing = highDemandSkills.filter((h) => !ownedSkills.has(h.name));

      return {
        trainerId: t.id,
        fullName: t.fullName,
        qualification: t.qualification,
        experienceYears: t.experienceYears,
        organization: t.organization?.name || 'Regional Training Institute',
        currentSkills: Array.from(ownedSkills),
        skillGaps: missing.map((m) => m.name),
        gapCount: missing.length,
        recommendedActions: missing.map((m) => ({
          skill: m.name,
          category: m.category,
          recommendedWorkshop: `Master Trainer Certification in ${m.name}`,
          duration: '40 Hours Intensive Pedagogy & Practical Lab',
          provider: 'Sector Skill Council (SSC)',
        })),
      };
    });

    return successResponse({
      highDemandIndustrySkills: highDemandSkillNames,
      trainerGaps,
    });
  } catch (err: any) {
    console.error('Trainer gaps error:', err);
    return errorResponse('Failed to calculate trainer gaps', 'SERVER_ERROR', 500);
  }
}
