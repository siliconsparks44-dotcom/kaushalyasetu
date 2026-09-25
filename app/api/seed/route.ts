export const dynamic = "force-dynamic";

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      return successResponse({ message: 'Database already has data. Seed skipped to prevent overwriting.' });
    }

    const defaultPassword = await bcrypt.hash('Password@123', 10);

    // 1. States & Districts
    const stateMH = await prisma.state.create({ data: { name: 'Maharashtra', code: 'MH' } });
    const distPune = await prisma.district.create({
      data: { name: 'Pune', code: 'MH-PUN', stateId: stateMH.id, population: 9429408, industrialBase: 'Automotive, IT, Engineering, Biotechnology' },
    });

    // 2. Sectors
    const secIT = await prisma.sector.create({
      data: { name: 'Information Technology & Software', code: 'IT_SWE', description: 'Software engineering, cloud computing, AI/ML, data analytics', growthRate: 14.8 },
    });
    const secEV = await prisma.sector.create({
      data: { name: 'Automotive & Electric Mobility', code: 'AUTO_EV', description: 'EV battery manufacturing, telematics, automotive diagnostics', growthRate: 28.5 },
    });

    // 3. Skills
    const sPython = await prisma.skill.create({ data: { name: 'Python', category: 'Programming', technology: 'Python 3.x', sector: 'IT' } });
    const sEV = await prisma.skill.create({ data: { name: 'EV Diagnostics', category: 'Automotive', technology: 'CAN Bus', sector: 'Automotive' } });
    const sSQL = await prisma.skill.create({ data: { name: 'SQL', category: 'Data', technology: 'PostgreSQL', sector: 'IT' } });

    // 4. Organization & Admin
    const govOrg = await prisma.organization.create({
      data: { name: 'State Directorate of Vocational Education', type: 'GOVERNMENT', verified: true },
    });

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@lmi.gov.in',
        passwordHash: defaultPassword,
        fullName: 'Dr. Ramesh Verma',
        role: 'ADMIN',
        organizationId: govOrg.id,
      },
    });

    // 5. Employer
    const empUser = await prisma.user.create({
      data: { email: 'employer@techcorp.com', passwordHash: defaultPassword, fullName: 'Pooja Sharma', role: 'EMPLOYER' },
    });
    const employerProfile = await prisma.employer.create({
      data: { userId: empUser.id, companyName: 'Apex Technologies Ltd', industrySector: 'Automotive & IT Mobility' },
    });

    // 6. Institute
    const instUser = await prisma.user.create({
      data: { email: 'institute@puneiti.edu.in', passwordHash: defaultPassword, fullName: 'Prof. Rajesh Kulkarni', role: 'INSTITUTE' },
    });
    const instProfile = await prisma.trainingInstitute.create({
      data: { userId: instUser.id, instituteName: 'Govt Polytechnic Pune', code: 'GP-PUN-042', instituteType: 'POLYTECHNIC' },
    });

    // 7. Trainer & Student
    await prisma.user.create({
      data: { email: 'trainer@skills.edu.in', passwordHash: defaultPassword, fullName: 'Anand Deshmukh', role: 'TRAINER' },
    });
    await prisma.user.create({
      data: { email: 'student@learner.org', passwordHash: defaultPassword, fullName: 'Kavita Patil', role: 'STUDENT' },
    });

    // 8. Sample Course
    const course = await prisma.course.create({
      data: {
        instituteId: instProfile.id,
        title: 'Electric Vehicle Maintenance & Diagnostics Technician',
        code: 'EV-TECH-201',
        sectorId: secEV.id,
        capacity: 60,
        description: 'Comprehensive industry-aligned course covering EV powertrain, lithium-ion battery management, and CAN bus telemetry.',
      },
    });

    await prisma.courseSkill.create({
      data: { courseId: course.id, skillId: sEV.id },
    });

    // 9. Sample Job
    const job = await prisma.job.create({
      data: {
        employerId: employerProfile.id,
        title: 'EV Powertrain Diagnostic Engineer',
        location: 'Pune',
        description: 'Seeking junior/mid-level diagnostic engineer for CAN Bus communication and battery testing.',
        openings: 15,
        salaryMin: 350000,
        salaryMax: 500000,
      },
    });

    await prisma.jobSkill.create({
      data: { jobId: job.id, skillId: sEV.id, importance: 'required' },
    });

    return successResponse({
      message: 'Database seeded successfully with demo accounts and benchmark records!',
      usersCreated: ['admin@lmi.gov.in', 'employer@techcorp.com', 'institute@puneiti.edu.in', 'trainer@skills.edu.in', 'student@learner.org'],
    });
  } catch (err: any) {
    console.error('Seed route error:', err);
    return errorResponse(err.message || 'Failed to seed database', 'SERVER_ERROR', 500);
  }
}
