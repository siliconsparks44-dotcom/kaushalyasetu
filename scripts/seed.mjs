import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seed Process for LMI-CAP ---');

  // Clean previous data
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.assessmentResult.deleteMany({});
  await prisma.assessmentQuestion.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.districtPlanRecommendation.deleteMany({});
  await prisma.districtPlan.deleteMany({});
  await prisma.skillDemandSnapshot.deleteMany({});
  await prisma.technologyTrend.deleteMany({});
  await prisma.trainingCapacity.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.trainerSkill.deleteMany({});
  await prisma.trainer.deleteMany({});
  await prisma.employerFeedback.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.industryConsultation.deleteMany({});
  await prisma.employerSurvey.deleteMany({});
  await prisma.curriculumRecommendation.deleteMany({});
  await prisma.curriculumVersion.deleteMany({});
  await prisma.curriculum.deleteMany({});
  await prisma.courseSkill.deleteMany({});
  await prisma.courseModule.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.jobSkill.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.trainingInstitute.deleteMany({});
  await prisma.employer.deleteMany({});
  await prisma.skillAlias.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.sector.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.district.deleteMany({});
  await prisma.state.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('Password@123', 10);

  // 1. States & Districts
  const stateMH = await prisma.state.create({
    data: { name: 'Maharashtra', code: 'MH' },
  });
  const stateKA = await prisma.state.create({
    data: { name: 'Karnataka', code: 'KA' },
  });
  const stateTN = await prisma.state.create({
    data: { name: 'Tamil Nadu', code: 'TN' },
  });

  const distPune = await prisma.district.create({
    data: {
      name: 'Pune',
      code: 'MH-PUN',
      stateId: stateMH.id,
      population: 9429408,
      industrialBase: 'Automotive, IT, Engineering, Biotechnology',
    },
  });

  const distMumbai = await prisma.district.create({
    data: {
      name: 'Mumbai Suburban',
      code: 'MH-MUM',
      stateId: stateMH.id,
      population: 9356962,
      industrialBase: 'Finance, IT Services, Media, Logistics',
    },
  });

  const distNagpur = await prisma.district.create({
    data: {
      name: 'Nagpur',
      code: 'MH-NAG',
      stateId: stateMH.id,
      population: 4653570,
      industrialBase: 'Logistics, Aerospace, Power, Manufacturing',
    },
  });

  const distBengaluru = await prisma.district.create({
    data: {
      name: 'Bengaluru Urban',
      code: 'KA-BLR',
      stateId: stateKA.id,
      population: 9621551,
      industrialBase: 'Software, Aerospace, DeepTech, Electronics',
    },
  });

  const distChennai = await prisma.district.create({
    data: {
      name: 'Chennai',
      code: 'TN-CHE',
      stateId: stateTN.id,
      population: 7088000,
      industrialBase: 'Automotive, Hardware, Healthcare, SaaS',
    },
  });

  // 2. Sectors
  const secIT = await prisma.sector.create({
    data: { name: 'Information Technology & Software', code: 'IT_SWE', description: 'Software engineering, cloud computing, AI/ML, data analytics', growthRate: 14.8 },
  });
  const secEV = await prisma.sector.create({
    data: { name: 'Automotive & Electric Mobility', code: 'AUTO_EV', description: 'EV battery manufacturing, telematics, automotive diagnostics, embedded systems', growthRate: 28.5 },
  });
  const secMFG = await prisma.sector.create({
    data: { name: 'Advanced Manufacturing & Automation', code: 'ADV_MFG', description: 'CNC programming, robotics, PLC automation, industrial CAD/CAM', growthRate: 11.2 },
  });
  const secENERGY = await prisma.sector.create({
    data: { name: 'Renewable Energy & Solar Tech', code: 'GREEN_ENG', description: 'Solar PV installation, microgrid maintenance, green hydrogen systems', growthRate: 22.0 },
  });

  // 3. Normalized Skill Taxonomy
  const skillsData = [
    { name: 'Python', category: 'Programming', technology: 'Python 3.x', sector: 'IT', aliases: ['py', 'python3', 'python programming'] },
    { name: 'JavaScript', category: 'Programming', technology: 'ECMAScript', sector: 'IT', aliases: ['js', 'javascript', 'java script', 'es6'] },
    { name: 'SQL', category: 'Data', technology: 'PostgreSQL/MySQL', sector: 'IT', aliases: ['structured query language', 'mysql', 'sql queries'] },
    { name: 'React', category: 'Programming', technology: 'React.js', sector: 'IT', aliases: ['reactjs', 'react.js', 'react native'] },
    { name: 'Docker', category: 'Cloud', technology: 'Containerization', sector: 'IT', aliases: ['containers', 'docker compose'] },
    { name: 'Power BI', category: 'Data', technology: 'Microsoft Power BI', sector: 'IT', aliases: ['powerbi', 'power-bi', 'pbi'] },
    { name: 'Machine Learning', category: 'Data', technology: 'Scikit-Learn/TensorFlow', sector: 'IT', aliases: ['ml', 'data science', 'ai/ml'] },
    { name: 'EV Diagnostics', category: 'Automotive', technology: 'OBD-II / CAN Bus', sector: 'Automotive', aliases: ['ev troubleshooting', 'battery diagnostics', 'can bus'] },
    { name: 'Battery Management Systems', category: 'Automotive', technology: 'BMS Architecture', sector: 'Automotive', aliases: ['bms', 'battery management', 'lithium ion tech'] },
    { name: 'CNC Programming', category: 'Manufacturing', technology: 'G-Code / Fanuc', sector: 'Manufacturing', aliases: ['g-code', 'cnc machine', 'fanuc programming'] },
    { name: 'CAD/CAM Design', category: 'Manufacturing', technology: 'AutoCAD / SolidWorks', sector: 'Manufacturing', aliases: ['autocad', 'solidworks', 'catia', 'cad design'] },
    { name: 'PLC Programming', category: 'Manufacturing', technology: 'Siemens / Allen Bradley', sector: 'Manufacturing', aliases: ['plc', 'scada', 'industrial automation'] },
    { name: 'Solar PV Installation', category: 'Energy', technology: 'Photovoltaic Systems', sector: 'Energy', aliases: ['solar panel install', 'pv design', 'rooftop solar'] },
  ];

  const skillMap = {};
  for (const s of skillsData) {
    const createdSkill = await prisma.skill.create({
      data: {
        name: s.name,
        category: s.category,
        technology: s.technology,
        sector: s.sector,
        description: `Standardized industrial competency for ${s.name}`,
      },
    });
    skillMap[s.name] = createdSkill;

    for (const alias of s.aliases) {
      await prisma.skillAlias.create({
        data: {
          alias: alias.toLowerCase(),
          skillId: createdSkill.id,
        },
      });
    }
  }

  // 4. Organizations
  const govOrg = await prisma.organization.create({
    data: {
      name: 'State Directorate of Vocational Education and Training (DVET)',
      type: 'GOVERNMENT',
      districtId: distMumbai.id,
      stateId: stateMH.id,
      contactEmail: 'admin@lmi.gov.in',
      contactPhone: '+91 22 2262 0601',
      address: '3, Mahapalika Marg, Dhobi Talao, Mumbai 400001',
      verified: true,
    },
  });

  const employerOrg = await prisma.organization.create({
    data: {
      name: 'Apex Technologies & Automotive Engineering Ltd',
      type: 'EMPLOYER',
      districtId: distPune.id,
      stateId: stateMH.id,
      contactEmail: 'careers@apextech.com',
      contactPhone: '+91 20 6601 8000',
      address: 'Hinjawadi Phase 2, Pune 411057',
      verified: true,
    },
  });

  const instituteOrg = await prisma.organization.create({
    data: {
      name: 'Government Polytechnic & Advanced Vocational Institute Pune',
      type: 'INSTITUTE',
      districtId: distPune.id,
      stateId: stateMH.id,
      contactEmail: 'contact@gppune.ac.in',
      contactPhone: '+91 20 2567 6878',
      address: 'University Road, Ganeshkhind, Pune 411016',
      verified: true,
    },
  });

  // 5. Users & Roles
  // A. Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@lmi.gov.in',
      passwordHash: defaultPassword,
      fullName: 'Dr. Ramesh Verma',
      role: 'ADMIN',
      organizationId: govOrg.id,
      accountStatus: 'ACTIVE',
    },
  });

  // B. Employer
  const employerUser = await prisma.user.create({
    data: {
      email: 'employer@techcorp.com',
      passwordHash: defaultPassword,
      fullName: 'Pooja Sharma',
      role: 'EMPLOYER',
      organizationId: employerOrg.id,
      accountStatus: 'ACTIVE',
    },
  });

  const employerProfile = await prisma.employer.create({
    data: {
      userId: employerUser.id,
      organizationId: employerOrg.id,
      companyName: 'Apex Technologies & Mobility Corp',
      industrySector: 'Automotive & IT Mobility',
      website: 'https://apextechmobility.example.com',
      description: 'Tier-1 automotive electronics and software developer building next-gen EV powertrains and cloud telematics.',
      companySize: '1000+',
      headquarters: 'Pune, Maharashtra',
    },
  });

  // C. Institute
  const instituteUser = await prisma.user.create({
    data: {
      email: 'institute@puneiti.edu.in',
      passwordHash: defaultPassword,
      fullName: 'Prof. Rajesh Kulkarni',
      role: 'INSTITUTE',
      organizationId: instituteOrg.id,
      accountStatus: 'ACTIVE',
    },
  });

  const instituteProfile = await prisma.trainingInstitute.create({
    data: {
      userId: instituteUser.id,
      organizationId: instituteOrg.id,
      instituteName: 'Government Polytechnic & Vocational Institute Pune',
      code: 'GP-PUN-042',
      instituteType: 'POLYTECHNIC',
      accreditation: 'AICTE / DTE Maharashtra Grade A+',
      districtId: distPune.id,
      stateId: stateMH.id,
      website: 'https://gppune.ac.in',
    },
  });

  // D. Trainer
  const trainerUser = await prisma.user.create({
    data: {
      email: 'trainer@skills.edu.in',
      passwordHash: defaultPassword,
      fullName: 'Anand Deshmukh',
      role: 'TRAINER',
      organizationId: instituteOrg.id,
      accountStatus: 'ACTIVE',
    },
  });

  const trainerProfile = await prisma.trainer.create({
    data: {
      userId: trainerUser.id,
      organizationId: instituteOrg.id,
      fullName: 'Anand Deshmukh',
      qualification: 'M.Tech in Mechatronics & Embedded Systems',
      experienceYears: 7,
      location: 'Pune',
      bio: 'Senior vocational instructor specializing in automotive electronic control units and industrial automation.',
    },
  });

  // Map Trainer Skills
  await prisma.trainerSkill.createMany({
    data: [
      { trainerId: trainerProfile.id, skillId: skillMap['Python'].id, proficiency: 'advanced', verified: true, certified: true, certificationName: 'Certified Python Programmer' },
      { trainerId: trainerProfile.id, skillId: skillMap['CAD/CAM Design'].id, proficiency: 'expert', verified: true, certified: true, certificationName: 'Autodesk Certified Professional' },
      { trainerId: trainerProfile.id, skillId: skillMap['PLC Programming'].id, proficiency: 'intermediate', verified: true, certified: false },
    ],
  });

  // E. Student
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@learner.org',
      passwordHash: defaultPassword,
      fullName: 'Kavita Patil',
      role: 'STUDENT',
      accountStatus: 'ACTIVE',
    },
  });

  const studentProfile = await prisma.student.create({
    data: {
      userId: studentUser.id,
      fullName: 'Kavita Patil',
      educationLevel: 'Diploma in Electrical Engineering',
      location: 'Pune',
      districtId: distPune.id,
      extractedSkills: JSON.stringify(['Python', 'SQL', 'CAD/CAM Design']),
      bio: 'Enthusiastic diploma graduate aiming to transition into Electric Vehicle powertrain diagnosis and industrial telematics.',
    },
  });

  // 6. Seed Jobs (with required skills)
  const job1 = await prisma.job.create({
    data: {
      employerId: employerProfile.id,
      title: 'EV Powertrain & Telematics Diagnostic Engineer',
      sectorId: secEV.id,
      districtId: distPune.id,
      location: 'Pune (Bhosari MIDC)',
      description: 'Seeking junior/mid-level diagnostic engineer for CAN Bus communication, Battery Management System testing, and Python telemetry analysis.',
      experienceLevel: 'entry',
      education: 'Diploma or B.Tech in Electrical / Electronics / Automotive',
      salaryMin: 350000,
      salaryMax: 500000,
      employmentType: 'FULL_TIME',
      openings: 18,
      status: 'ACTIVE',
      source: 'INTERNAL',
      isDemo: true,
    },
  });

  await prisma.jobSkill.createMany({
    data: [
      { jobId: job1.id, skillId: skillMap['EV Diagnostics'].id, proficiency: 'intermediate', importance: 'required' },
      { jobId: job1.id, skillId: skillMap['Battery Management Systems'].id, proficiency: 'intermediate', importance: 'required' },
      { jobId: job1.id, skillId: skillMap['Python'].id, proficiency: 'intermediate', importance: 'preferred' },
    ],
  });

  const job2 = await prisma.job.create({
    data: {
      employerId: employerProfile.id,
      title: 'Junior Full-Stack Analytics Developer',
      sectorId: secIT.id,
      districtId: distPune.id,
      location: 'Pune (Hinjawadi)',
      description: 'Develop enterprise operations dashboards using Python, SQL databases, React UI, and Power BI reporting integrations.',
      experienceLevel: 'entry',
      education: 'B.Sc / BCA / B.Tech / Diploma Computer Science',
      salaryMin: 400000,
      salaryMax: 600000,
      employmentType: 'FULL_TIME',
      openings: 25,
      status: 'ACTIVE',
      source: 'INTERNAL',
      isDemo: true,
    },
  });

  await prisma.jobSkill.createMany({
    data: [
      { jobId: job2.id, skillId: skillMap['Python'].id, proficiency: 'intermediate', importance: 'required' },
      { jobId: job2.id, skillId: skillMap['SQL'].id, proficiency: 'intermediate', importance: 'required' },
      { jobId: job2.id, skillId: skillMap['React'].id, proficiency: 'beginner', importance: 'required' },
      { jobId: job2.id, skillId: skillMap['Power BI'].id, proficiency: 'intermediate', importance: 'preferred' },
    ],
  });

  const job3 = await prisma.job.create({
    data: {
      employerId: employerProfile.id,
      title: 'CNC Precision Machine Programmer & Operator',
      sectorId: secMFG.id,
      districtId: distPune.id,
      location: 'Pune (Chakan Industrial Zone)',
      description: 'Setup and execute CNC multi-axis milling, G-code programming, and CAD/CAM component verification for automotive transmission parts.',
      experienceLevel: 'mid',
      education: 'ITI Machinist / Turner / Diploma Mechanical',
      salaryMin: 280000,
      salaryMax: 420000,
      employmentType: 'FULL_TIME',
      openings: 30,
      status: 'ACTIVE',
      source: 'INTERNAL',
      isDemo: true,
    },
  });

  await prisma.jobSkill.createMany({
    data: [
      { jobId: job3.id, skillId: skillMap['CNC Programming'].id, proficiency: 'advanced', importance: 'required' },
      { jobId: job3.id, skillId: skillMap['CAD/CAM Design'].id, proficiency: 'intermediate', importance: 'required' },
      { jobId: job3.id, skillId: skillMap['PLC Programming'].id, proficiency: 'beginner', importance: 'optional' },
    ],
  });

  // 7. Seed Courses & Curricula
  const course1 = await prisma.course.create({
    data: {
      instituteId: instituteProfile.id,
      title: 'Electric Vehicle Maintenance & Diagnostics Technician',
      code: 'EV-TECH-201',
      sectorId: secEV.id,
      qualification: 'Vocational Diploma',
      durationWeeks: 16,
      level: 'intermediate',
      description: 'Comprehensive industry-aligned course covering EV powertrain basics, lithium-ion battery management, CAN bus telemetry, and workshop safety protocols.',
      capacity: 60,
      districtId: distPune.id,
      status: 'ACTIVE',
      isDemo: true,
    },
  });

  await prisma.courseModule.createMany({
    data: [
      { courseId: course1.id, title: 'EV Powertrain Architecture & High-Voltage Safety', description: 'Inverter systems, safety disconnect, DC-DC converter basics', theoryHours: 25, practicalHours: 35, orderIndex: 1 },
      { courseId: course1.id, title: 'Lithium-Ion Battery Systems & BMS Diagnostics', description: 'Thermal runaway prevention, cell balancing, CAN protocol diagnostics', theoryHours: 30, practicalHours: 50, orderIndex: 2 },
      { courseId: course1.id, title: 'OBD-II Fault Tracing & Telematics Analysis', description: 'Troubleshooting diagnostic trouble codes with digital multimeters and Python logs', theoryHours: 20, practicalHours: 40, orderIndex: 3 },
    ],
  });

  // Mapped skills for Course 1
  await prisma.courseSkill.createMany({
    data: [
      { courseId: course1.id, skillId: skillMap['EV Diagnostics'].id, proficiency: 'intermediate', theoryHours: 20, practicalHours: 40 },
      { courseId: course1.id, skillId: skillMap['Battery Management Systems'].id, proficiency: 'intermediate', theoryHours: 25, practicalHours: 45 },
    ],
  });

  const curr1 = await prisma.curriculum.create({
    data: {
      courseId: course1.id,
      title: 'EV Maintenance & Diagnostics Curriculum Framework',
      currentVersion: 'v1.1',
      status: 'PUBLISHED',
      learningOutcomes: 'Diagnose EV charging faults; isolate faulty BMS cell banks; execute high-voltage lockout/tagout procedures.',
      assessmentMethod: 'Practical bench evaluation (60%) + Online MCQ assessment (40%)',
      trainerRequirements: 'Minimum 3 years experience in Automotive electrical systems with certified EV training.',
      equipmentRequirements: 'EV Diagnostic bench, 48V battery trainer module, digital storage oscilloscopes.',
    },
  });

  await prisma.curriculumVersion.createMany({
    data: [
      { curriculumId: curr1.id, versionNumber: 'v1.0', changeSummary: 'Initial baseline curriculum launched for academic year 2025.', status: 'SUPERSEDED' },
      { curriculumId: curr1.id, versionNumber: 'v1.1', changeSummary: 'Updated CAN-bus diagnostics and upgraded battery thermal run test modules.', approvedBy: 'Dr. Ramesh Verma (Admin)', status: 'ACTIVE' },
    ],
  });

  // AI Curriculum Recommendation for Course 1 (Pending human approval)
  await prisma.curriculumRecommendation.create({
    data: {
      courseId: course1.id,
      actionType: 'ADD',
      skillId: skillMap['Python'].id,
      affectedModule: 'OBD-II Fault Tracing & Telematics Analysis',
      reason: '74% of EV diagnostic job openings in Pune and Bengaluru require basic Python scripting to parse CAN Bus telemetry logs.',
      supportingData: JSON.stringify({ localVacancies: 18, demandGrowthPct: 34.5, currentCoverage: 0 }),
      confidence: 0.92,
      source: 'AI_LABOUR_MARKET_INTELLIGENCE',
      status: 'PENDING',
    },
  });

  const course2 = await prisma.course.create({
    data: {
      instituteId: instituteProfile.id,
      title: 'Advanced Precision CNC Machining & CAD/CAM',
      code: 'CNC-CAD-102',
      sectorId: secMFG.id,
      qualification: 'Technical Certificate',
      durationWeeks: 20,
      level: 'intermediate',
      description: 'Hands-on programming and operation of 3-axis CNC vertical machining centres and 2D/3D CAD design models.',
      capacity: 45,
      districtId: distPune.id,
      status: 'ACTIVE',
      isDemo: true,
    },
  });

  await prisma.courseSkill.createMany({
    data: [
      { courseId: course2.id, skillId: skillMap['CNC Programming'].id, proficiency: 'intermediate', theoryHours: 30, practicalHours: 70 },
      { courseId: course2.id, skillId: skillMap['CAD/CAM Design'].id, proficiency: 'intermediate', theoryHours: 25, practicalHours: 45 },
    ],
  });

  // 8. Equipment Management & Gaps
  await prisma.equipment.createMany({
    data: [
      {
        instituteId: instituteOrg.id,
        name: '3-Axis CNC Vertical Machining Center (Fanuc 0i-MF)',
        category: 'CNC/Machinery',
        totalQuantity: 4,
        availableQuantity: 3,
        conditionStatus: 'OPERATIONAL',
        location: 'Workshop Block B, Lab 1',
        courseId: course2.id,
        requiredSkills: 'CNC Programming, CAD/CAM Design',
      },
      {
        instituteId: instituteOrg.id,
        name: 'Modular Electric Vehicle Diagnostic Test Bench (48V/72V)',
        category: 'Electrical/EV',
        totalQuantity: 5,
        availableQuantity: 2,
        conditionStatus: 'MAINTENANCE',
        location: 'Automotive Electrical Lab 3',
        courseId: course1.id,
        requiredSkills: 'EV Diagnostics, Battery Management Systems',
      },
      {
        instituteId: instituteOrg.id,
        name: 'High-Performance CAD Workstations with 3D Accelerators',
        category: 'Computing',
        totalQuantity: 30,
        availableQuantity: 28,
        conditionStatus: 'OPERATIONAL',
        location: 'Computer Centre 2',
        courseId: course2.id,
        requiredSkills: 'CAD/CAM Design, Python',
      },
    ],
  });

  // 9. Training Capacity, Vacancy & Oversupply Tracking
  await prisma.trainingCapacity.createMany({
    data: [
      {
        districtId: distPune.id,
        sectorId: secEV.id,
        courseId: course1.id,
        skillId: skillMap['EV Diagnostics'].id,
        currentCapacity: 120,
        enrolledStudents: 110,
        vacancyCount: 380,
        placementRate: 88.5,
        oversupplyFlag: false,
        reviewRecommended: false,
        year: 2026,
      },
      {
        districtId: distPune.id,
        sectorId: secMFG.id,
        courseId: course2.id,
        skillId: skillMap['CNC Programming'].id,
        currentCapacity: 90,
        enrolledStudents: 85,
        vacancyCount: 160,
        placementRate: 78.0,
        oversupplyFlag: false,
        reviewRecommended: false,
        year: 2026,
      },
      {
        districtId: distPune.id,
        sectorId: secIT.id,
        currentCapacity: 600,
        enrolledStudents: 580,
        vacancyCount: 190,
        placementRate: 34.0,
        oversupplyFlag: true,
        reviewRecommended: true,
        year: 2026,
      },
    ],
  });

  // 10. Technology Trends
  await prisma.technologyTrend.createMany({
    data: [
      {
        name: 'Electric Vehicle Telematics & CAN Diagnostics',
        sectorId: secEV.id,
        growthRatePercent: 38.4,
        industryAdoptionLevel: 'HIGH',
        requiredSkills: 'EV Diagnostics, Battery Management Systems, Python',
        trainingReadinessScore: 52.0,
        description: 'Exponential shift towards connected commercial and two-wheeler EVs necessitating real-time battery analytics.',
        source: 'Automotive Skill Development Council (ASDC) 2026',
      },
      {
        name: 'Industrial Collaborative Robotics & PLC Automation',
        sectorId: secMFG.id,
        growthRatePercent: 24.1,
        industryAdoptionLevel: 'EMERGING',
        requiredSkills: 'PLC Programming, CNC Programming, CAD/CAM Design',
        trainingReadinessScore: 40.0,
        description: 'Industry 4.0 shop floors integrating cobots alongside CNC toolpaths for auto assembly.',
        source: 'National Council for Vocational Education (NCVE)',
      },
      {
        name: 'Generative AI & Data Pipeline Engineering',
        sectorId: secIT.id,
        growthRatePercent: 46.2,
        industryAdoptionLevel: 'HIGH',
        requiredSkills: 'Python, SQL, Machine Learning, Docker',
        trainingReadinessScore: 35.0,
        description: 'Enterprise integration of AI agents and custom analytical models directly into production lines.',
        source: 'NASSCOM FutureSkills 2026',
      },
    ],
  });

  // 11. Employer Survey & Industry Consultation
  await prisma.employerSurvey.create({
    data: {
      employerId: employerProfile.id,
      surveyYear: 2026,
      quarter: 3,
      difficultToHireRoles: JSON.stringify(['EV Diagnostics Engineer', 'Senior CNC Programmer', 'Industrial Telematics Specialist']),
      emergingTechNeeds: JSON.stringify(['Battery Cell Balancing', 'CAN Bus Decoding', 'Containerized Edge Analytics']),
      productivityFeedback: 'New polytechnic graduates require 3-4 months of on-job bridge training on actual CAN analyzers.',
      trainingRequirements: 'Urgent need for hands-on bench test kits and practical simulation hours before graduation.',
      rawResponses: JSON.stringify({ satisfactionScore: 4, hiringPace: 'ACCELERATING', projectedHiresNext6Months: 45 }),
    },
  });

  await prisma.industryConsultation.create({
    data: {
      companyName: 'Apex Technologies & Automotive Engineering Ltd',
      sectorId: secEV.id,
      expertName: 'Dr. Vikram Sen (VP of Powertrain Engineering)',
      location: 'Pune',
      roleEvaluated: 'EV Powertrain Diagnostic Technician',
      requiredSkills: 'EV Diagnostics, Battery Management Systems, Python, High Voltage Safety',
      emergingTech: 'Solid-state battery diagnostics, CCS-2 fast charging safety',
      curriculumSuggestions: 'Incorporate 15 hours of live vehicle diagnostic scanner practice into Module 3.',
      equipmentRequirements: 'Digital CAN-Bus logging analyzers, thermal imaging cameras for battery packs',
      trainerRequirements: 'Faculty must undergo 40 hours of ASDC Level-5 master trainer certification',
      notes: 'Consultation conducted at DVET zonal meeting. Strong willingness from employer to donate 2 test battery benches.',
      conductedBy: 'Dr. Ramesh Verma',
    },
  });

  // 12. Placements & Employer Feedback
  const placement1 = await prisma.placement.create({
    data: {
      studentId: studentProfile.id,
      courseId: course1.id,
      employerName: 'Apex Technologies & Mobility Corp',
      role: 'Junior EV Diagnostics Technician',
      salary: 420000,
      location: 'Pune',
      employmentType: 'FULL_TIME',
      skillsUsed: 'EV Diagnostics, Battery Management Systems, Multimeter Testing',
    },
  });

  await prisma.employerFeedback.create({
    data: {
      placementId: placement1.id,
      employerId: employerProfile.id,
      candidateJobReady: true,
      technicalSkillRating: 4,
      softSkillRating: 5,
      productivityRating: 4,
      trainingRelevanceRating: 5,
      curriculumFeedback: 'Candidate showed strong practical grasp of high-voltage isolation. Additional training on Python telemetry would make candidates immediate day-1 productive.',
    },
  });

  // 13. District Training Plan (Draft for Pune)
  const distPlan1 = await prisma.districtPlan.create({
    data: {
      title: 'Pune District Annual Skill Training Plan 2026-27 (Automotive & EV)',
      stateId: stateMH.id,
      districtId: distPune.id,
      sectorId: secEV.id,
      targetYear: 2026,
      status: 'PUBLISHED',
      highDemandRoles: JSON.stringify(['EV Diagnostics Technician', 'Battery Pack Assembler', 'Automotive Telematics Specialist']),
      highDemandSkills: JSON.stringify(['EV Diagnostics', 'Battery Management Systems', 'Python', 'High-Voltage Safety']),
      currentCapacity: 120,
      recommendedCapacity: 350,
      trainerGapCount: 6,
      equipmentGapCount: 14,
      justification: 'Automotive cluster growth in Chakan and Bhosari has generated 850+ projected EV service vacancies against an existing polytechnic capacity of only 120 seats.',
      createdBy: 'Dr. Ramesh Verma (Admin)',
    },
  });

  await prisma.districtPlanRecommendation.createMany({
    data: [
      {
        districtPlanId: distPlan1.id,
        type: 'CAPACITY_EXPANSION',
        title: 'Expand EV Maintenance Course Seats to 350 across Pune Poly/ITIs',
        description: 'Increase annual intake from 60 to 180 in GP Pune and add 170 seats across ITI Aundh and ITI Haveli.',
        priority: 'HIGH',
        metricsEvidence: '380 active district vacancies vs 120 current intake (Capacity deficit: 260 seats)',
      },
      {
        districtPlanId: distPlan1.id,
        type: 'TRAINER_UPSKILLING',
        title: 'Conduct Master Trainer Workshop on High-Voltage Battery Systems',
        description: 'Sponsor 6 mechanical & electrical instructors for certified Level-5 EV Master Trainer accreditation.',
        priority: 'HIGH',
        metricsEvidence: 'Only 1 out of 7 district instructors currently certified in lithium-ion BMS diagnostics.',
      },
      {
        districtPlanId: distPlan1.id,
        type: 'EQUIPMENT_PROCUREMENT',
        title: 'Procure 14 Modular 48V Battery Diagnostic Stations',
        description: 'Equip 3 polytechnic labs with modern CAN-bus logging tools and thermal imaging sensors.',
        priority: 'MEDIUM',
        metricsEvidence: 'Available test units: 5 across Pune, with 3 under maintenance.',
      },
    ],
  });

  // 14. Skill Assessment & Questions
  const assess1 = await prisma.assessment.create({
    data: {
      title: 'Electric Vehicle Diagnostics & Safety Fundamentals',
      skillId: skillMap['EV Diagnostics'].id,
      description: 'Standard benchmark assessment testing high-voltage safety interlocks, CAN Bus troubleshooting, and BMS faults.',
      durationMinutes: 20,
      passingScore: 70,
    },
  });

  await prisma.assessmentQuestion.createMany({
    data: [
      {
        assessmentId: assess1.id,
        questionText: 'What is the standard procedure before servicing high-voltage components in an EV?',
        optionsJson: JSON.stringify([
          'Disconnect the 12V auxiliary battery and pull the High Voltage Service Disconnect (Manual Service Disconnect)',
          'Immediately remove the motor inverter cover with insulated gloves',
          'Discharge the battery by running the air conditioning at maximum power',
          'Connect an OBD-II scanner while the high-voltage contactors are energized'
        ]),
        correctOptionIndex: 0,
      },
      {
        assessmentId: assess1.id,
        questionText: 'Which protocol is most commonly used for in-vehicle sensor and electronic control unit (ECU) communication in modern EVs?',
        optionsJson: JSON.stringify([
          'CAN (Controller Area Network) Bus',
          'RS-232 Serial Port',
          'Ethernet 10BASE-T only',
          'Direct Analog Potentiometer'
        ]),
        correctOptionIndex: 0,
      },
      {
        assessmentId: assess1.id,
        questionText: 'In a Lithium-ion Battery Management System (BMS), what is the primary role of cell balancing?',
        optionsJson: JSON.stringify([
          'To equalize state-of-charge (SoC) among cells to maximize usable capacity and prevent overcharging',
          'To physically balance the weight of the battery pack across vehicle axles',
          'To increase the chemical voltage of single cells beyond 4.5V',
          'To convert DC current into 3-phase AC voltage'
        ]),
        correctOptionIndex: 0,
      },
    ],
  });

  // 15. Notifications
  await prisma.notification.createMany({
    data: [
      {
        role: 'ADMIN',
        title: 'Course Oversupply Detected in District Pune',
        message: 'Information Technology generic intake has a low placement rate of 34% with 600 seats vs 190 vacancies. Review recommended.',
        type: 'WARNING',
        link: '/dashboard/admin',
      },
      {
        role: 'INSTITUTE',
        title: 'New AI Curriculum Recommendation for EV-TECH-201',
        message: 'Recommendation to add Python telemetry scripting based on 74% employer demand in Pune.',
        type: 'INFO',
        link: '/dashboard/alignment',
      },
      {
        userId: trainerUser.id,
        title: 'Trainer Upskilling Opportunity',
        message: 'Upcoming Master Trainer Workshop on Lithium-Ion Battery Systems has open nominations.',
        type: 'SUCCESS',
        link: '/dashboard/trainer',
      },
    ],
  });

  // 16. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_SEED_INITIALIZED',
      entityType: 'PLATFORM',
      entityId: 'ROOT',
      detailsJson: JSON.stringify({ notes: 'Complete seed data with clearly labeled DEMO DATA successfully loaded.' }),
      ipAddress: '127.0.0.1',
    },
  });

  console.log('✅ Seed completed successfully!');
  console.log('--- Demo Accounts Created ---');
  console.log('1. Admin: admin@lmi.gov.in / Password@123');
  console.log('2. Employer: employer@techcorp.com / Password@123');
  console.log('3. Institute: institute@puneiti.edu.in / Password@123');
  console.log('4. Trainer: trainer@skills.edu.in / Password@123');
  console.log('5. Student: student@learner.org / Password@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
