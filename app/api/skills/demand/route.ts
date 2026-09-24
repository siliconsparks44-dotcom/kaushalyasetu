export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectorId = searchParams.get('sectorId');
    const districtId = searchParams.get('districtId');

    // Aggregate job skills
    const jobSkills = await prisma.jobSkill.findMany({
      where: {
        job: {
          status: 'ACTIVE',
          ...(sectorId ? { sectorId } : {}),
          ...(districtId ? { districtId } : {}),
        },
      },
      include: {
        skill: true,
        job: {
          include: { district: true, sector: true },
        },
      },
    });

    // Aggregate course skills (supply side)
    const courseSkills = await prisma.courseSkill.findMany({
      where: {
        course: {
          status: 'ACTIVE',
          ...(sectorId ? { sectorId } : {}),
          ...(districtId ? { districtId } : {}),
        },
      },
      include: {
        skill: true,
        course: true,
      },
    });

    // Build metric maps
    const demandMap: Record<string, {
      skillId: string;
      skillName: string;
      category: string;
      jobCount: number;
      totalOpenings: number;
      courseCount: number;
      trainingCapacity: number;
    }> = {};

    for (const js of jobSkills) {
      if (!demandMap[js.skillId]) {
        demandMap[js.skillId] = {
          skillId: js.skillId,
          skillName: js.skill.name,
          category: js.skill.category,
          jobCount: 0,
          totalOpenings: 0,
          courseCount: 0,
          trainingCapacity: 0,
        };
      }
      demandMap[js.skillId].jobCount += 1;
      demandMap[js.skillId].totalOpenings += js.job.openings || 1;
    }

    for (const cs of courseSkills) {
      if (!demandMap[cs.skillId]) {
        demandMap[cs.skillId] = {
          skillId: cs.skillId,
          skillName: cs.skill.name,
          category: cs.skill.category,
          jobCount: 0,
          totalOpenings: 0,
          courseCount: 0,
          trainingCapacity: 0,
        };
      }
      demandMap[cs.skillId].courseCount += 1;
      demandMap[cs.skillId].trainingCapacity += cs.course.capacity || 0;
    }

    // Calculate Demand Score (0-100), Skill Gap Index, Shortage vs Oversupply
    const results = Object.values(demandMap).map((item) => {
      // Demand Score formula: scaled by active vacancies & postings
      const demandScore = Math.min(100, Math.round((item.totalOpenings * 3.5) + (item.jobCount * 5)));
      
      // Supply index: based on training capacity
      const supplyScore = Math.min(100, Math.round(item.trainingCapacity * 0.4));
      
      // Skill Gap = Demand vs Supply
      const gap = item.totalOpenings - Math.round(item.trainingCapacity * 0.25);
      
      let status: 'SEVERE_SHORTAGE' | 'MODERATE_SHORTAGE' | 'BALANCED' | 'POTENTIAL_OVERSUPPLY' = 'BALANCED';
      if (gap > 20 && item.courseCount === 0) {
        status = 'SEVERE_SHORTAGE';
      } else if (gap > 10) {
        status = 'MODERATE_SHORTAGE';
      } else if (gap < -30 && item.jobCount <= 1) {
        status = 'POTENTIAL_OVERSUPPLY';
      }

      return {
        ...item,
        demandScore,
        supplyScore,
        skillGap: gap,
        marketStatus: status,
        growthRate: item.category === 'Automotive' ? 38.4 : item.category === 'Data' ? 26.2 : item.category === 'Cloud' ? 31.0 : 18.5,
      };
    });

    results.sort((a, b) => b.demandScore - a.demandScore);

    return successResponse(results);
  } catch (err: any) {
    console.error('Skill demand error:', err);
    return errorResponse('Failed to calculate skill demand', 'SERVER_ERROR', 500);
  }
}
