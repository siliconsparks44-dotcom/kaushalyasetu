export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'ACTIVE' },
      include: {
        equipment: true,
        institute: true,
      },
    });

    // Required ratio: 1 equipment station per 4 students capacity
    const equipmentAnalysis = courses.map((course) => {
      const requiredStations = Math.ceil((course.capacity || 60) / 4);
      const totalUnits = course.equipment.reduce((acc, eq) => acc + eq.totalQuantity, 0);
      const operationalUnits = course.equipment.reduce((acc, eq) => acc + (eq.conditionStatus === 'OPERATIONAL' ? eq.availableQuantity : 0), 0);
      const gap = Math.max(0, requiredStations - operationalUnits);

      return {
        courseId: course.id,
        courseTitle: course.title,
        courseCode: course.code,
        institute: course.institute.instituteName,
        enrolledCapacity: course.capacity,
        prescribedStandardRatio: '1 workstation : 4 trainees',
        requiredUnits: requiredStations,
        totalInventory: totalUnits,
        operationalUnits,
        equipmentGap: gap,
        adequacyRatePercent: Math.min(100, Math.round((operationalUnits / (requiredStations || 1)) * 100)),
        status: gap === 0 ? 'ADEQUATE' : gap > 8 ? 'CRITICAL_DEFICIT' : 'MODERATE_DEFICIT',
      };
    });

    return successResponse(equipmentAnalysis);
  } catch (err: any) {
    console.error('Equipment gaps error:', err);
    return errorResponse('Failed to calculate equipment gaps', 'SERVER_ERROR', 500);
  }
}
