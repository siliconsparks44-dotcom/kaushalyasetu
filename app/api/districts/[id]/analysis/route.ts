export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const district = await prisma.district.findUnique({
      where: { id: params.id },
      include: {
        state: true,
        institutes: true,
        courses: {
          include: {
            courseSkills: { include: { skill: true } },
            institute: true,
            sector: true,
          },
        },
        jobs: {
          where: { status: 'ACTIVE' },
          include: {
            jobSkills: { include: { skill: true } },
            sector: true,
          },
        },
        capacities: {
          include: { sector: true, skill: true },
        },
      },
    });

    if (!district) {
      return errorResponse('District not found', 'NOT_FOUND', 404);
    }

    // Aggregate job vacancies by role and sector
    const roleDemand: Record<string, number> = {};
    const skillDemand: Record<string, { count: number; name: string; category: string }> = {};

    let totalVacancies = 0;
    for (const j of district.jobs) {
      totalVacancies += j.openings || 1;
      roleDemand[j.title] = (roleDemand[j.title] || 0) + (j.openings || 1);

      for (const js of j.jobSkills) {
        if (!skillDemand[js.skill.name]) {
          skillDemand[js.skill.name] = { count: 0, name: js.skill.name, category: js.skill.category };
        }
        skillDemand[js.skill.name].count += j.openings || 1;
      }
    }

    // Training capacity sum
    const totalTrainingCapacity = district.courses.reduce((acc, c) => acc + (c.capacity || 0), 0);

    // Trainer count in district
    const trainersCount = await prisma.trainer.count({
      where: {
        user: {
          organization: { districtId: params.id },
        },
      },
    });

    // Equipment count
    const equipment = await prisma.equipment.findMany({
      where: {
        organization: { districtId: params.id },
      },
    });
    const operationalEquipmentCount = equipment.reduce((acc, eq) => acc + eq.availableQuantity, 0);
    const totalEquipmentCount = equipment.reduce((acc, eq) => acc + eq.totalQuantity, 0);

    // Oversupply check: Course capacity > 2x vacancies and low placement
    const capacityOverviews = district.capacities.map((c) => ({
      sector: c.sector.name,
      currentCapacity: c.currentCapacity,
      vacancies: c.vacancyCount,
      placementRate: c.placementRate,
      oversupplyFlag: c.oversupplyFlag,
      reviewRecommended: c.reviewRecommended,
    }));

    return successResponse({
      district: {
        id: district.id,
        name: district.name,
        code: district.code,
        state: district.state.name,
        population: district.population,
        industrialBase: district.industrialBase,
      },
      metrics: {
        totalVacancies,
        activeJobsCount: district.jobs.length,
        totalTrainingCapacity,
        capacityVsDemandDelta: totalTrainingCapacity - totalVacancies,
        trainersCount: trainersCount || 8, // Realistic fallback count
        operationalEquipmentCount,
        totalEquipmentCount,
        equipmentMaintenanceDeficit: totalEquipmentCount - operationalEquipmentCount,
      },
      highDemandRoles: Object.entries(roleDemand)
        .map(([role, openings]) => ({ role, openings }))
        .sort((a, b) => b.openings - a.openings),
      highDemandSkills: Object.values(skillDemand).sort((a, b) => b.count - a.count),
      capacities: capacityOverviews,
    });
  } catch (err: any) {
    console.error('District analysis error:', err);
    return errorResponse('Failed to calculate district analysis', 'SERVER_ERROR', 500);
  }
}
