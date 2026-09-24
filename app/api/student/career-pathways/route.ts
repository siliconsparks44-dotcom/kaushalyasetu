export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    let userSkills: string[] = ['Python', 'SQL'];

    if (user && user.studentProfile && user.studentProfile.extractedSkills) {
      try {
        userSkills = JSON.parse(user.studentProfile.extractedSkills);
      } catch (e) {
        // fallback
      }
    }

    const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase()));

    // Define industry standard career pathways
    const predefinedPathways = [
      {
        pathwayId: 'pathway-ev-diagnostic',
        title: 'Electric Vehicle & Telematics Diagnostic Specialist',
        sector: 'Automotive & Electric Mobility',
        growthRate: '38.4% Annual Sector Expansion',
        stages: [
          {
            stage: 1,
            role: 'Junior Electrical / Auto Technician',
            requiredSkills: ['Electrical Basics', 'Multimeter Testing', 'High-Voltage Safety'],
            duration: '0-1 Years',
          },
          {
            stage: 2,
            role: 'EV Maintenance Technician',
            requiredSkills: ['High-Voltage Safety', 'EV Diagnostics', 'Battery Management Systems'],
            duration: '1-3 Years',
          },
          {
            stage: 3,
            role: 'EV Powertrain Diagnostic Specialist',
            requiredSkills: ['EV Diagnostics', 'Battery Management Systems', 'CAN Bus Decoding', 'Python'],
            duration: '3-5 Years',
          },
          {
            stage: 4,
            role: 'Lead Vehicle Telematics & Systems Architect',
            requiredSkills: ['CAN Bus Decoding', 'Python', 'Docker', 'Machine Learning'],
            duration: '5+ Years',
          },
        ],
      },
      {
        pathwayId: 'pathway-cnc-automation',
        title: 'Advanced CNC Machining & Industrial Robotics Engineer',
        sector: 'Advanced Manufacturing & Automation',
        growthRate: '24.1% Industry 4.0 Adoption',
        stages: [
          {
            stage: 1,
            role: 'CNC Machine Operator',
            requiredSkills: ['Workshop Safety', 'Blueprint Reading', 'CNC Programming'],
            duration: '0-1 Years',
          },
          {
            stage: 2,
            role: 'CNC Multi-Axis Programmer',
            requiredSkills: ['CNC Programming', 'CAD/CAM Design', 'G-Code Optimization'],
            duration: '1-3 Years',
          },
          {
            stage: 3,
            role: 'Mechatronics & Automation Specialist',
            requiredSkills: ['CAD/CAM Design', 'PLC Programming', 'SCADA', 'Industrial Cobots'],
            duration: '3-5 Years',
          },
        ],
      },
      {
        pathwayId: 'pathway-data-ai',
        title: 'Data & AI Operations Engineer',
        sector: 'Information Technology & Software',
        growthRate: '46.2% AI Integration Rate',
        stages: [
          {
            stage: 1,
            role: 'Junior Data Analyst',
            requiredSkills: ['Python', 'SQL', 'Excel Reporting'],
            duration: '0-1 Years',
          },
          {
            stage: 2,
            role: 'BI & Analytics Developer',
            requiredSkills: ['Python', 'SQL', 'Power BI', 'React'],
            duration: '1-3 Years',
          },
          {
            stage: 3,
            role: 'AI / Machine Learning Engineer',
            requiredSkills: ['Python', 'SQL', 'Machine Learning', 'Docker'],
            duration: '3-5 Years',
          },
        ],
      },
    ];

    // For each pathway stage, compute user's owned vs missing skills
    const evaluatedPathways = predefinedPathways.map((pathway) => {
      const evaluatedStages = pathway.stages.map((stage) => {
        const owned = stage.requiredSkills.filter((s) => userSkillSet.has(s.toLowerCase()));
        const missing = stage.requiredSkills.filter((s) => !userSkillSet.has(s.toLowerCase()));
        const readiness = Math.round((owned.length / (stage.requiredSkills.length || 1)) * 100);

        return {
          ...stage,
          ownedSkills: owned,
          missingSkills: missing,
          readinessPercent: readiness,
        };
      });

      return {
        ...pathway,
        stages: evaluatedStages,
      };
    });

    // Also fetch matching courses to address missing skills
    const courses = await prisma.course.findMany({
      where: { status: 'ACTIVE' },
      include: {
        courseSkills: { include: { skill: true } },
        institute: true,
      },
    });

    return successResponse({
      studentSkills: userSkills,
      pathways: evaluatedPathways,
      availableCourses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        code: c.code,
        institute: c.institute.instituteName,
        skills: c.courseSkills.map((cs) => cs.skill.name),
      })),
    });
  } catch (err: any) {
    console.error('Career pathway error:', err);
    return errorResponse('Failed to calculate career pathways', 'SERVER_ERROR', 500);
  }
}
