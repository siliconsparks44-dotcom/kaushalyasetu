import { prisma } from './prisma';

export interface NormalizedSkillResult {
  id: string;
  name: string;
  category: string;
  isExisting: boolean;
}

/**
 * Normalizes an input skill string to its canonical database entity
 */
export async function normalizeSkillName(rawName: string): Promise<NormalizedSkillResult> {
  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase();

  // 1. Direct match on Skill name
  const directMatch = await prisma.skill.findFirst({
    where: {
      name: {
        equals: trimmed,
      },
    },
  });

  if (directMatch) {
    return {
      id: directMatch.id,
      name: directMatch.name,
      category: directMatch.category,
      isExisting: true,
    };
  }

  // 2. Check SkillAlias table
  const aliasMatch = await prisma.skillAlias.findFirst({
    where: {
      alias: lower,
    },
    include: {
      skill: true,
    },
  });

  if (aliasMatch && aliasMatch.skill) {
    return {
      id: aliasMatch.skill.id,
      name: aliasMatch.skill.name,
      category: aliasMatch.skill.category,
      isExisting: true,
    };
  }

  // 3. Fallback: Create new or return clean formatted representation
  // Format as Title Case
  const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const created = await prisma.skill.create({
    data: {
      name: formatted,
      category: 'General Technical',
      description: `Discovered industrial skill competency: ${formatted}`,
    },
  });

  await prisma.skillAlias.create({
    data: {
      alias: lower,
      skillId: created.id,
    },
  });

  return {
    id: created.id,
    name: created.name,
    category: created.category,
    isExisting: false,
  };
}

/**
 * Calculates evidence-based course-to-industry alignment score
 */
export async function calculateCourseAlignment(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      courseSkills: {
        include: { skill: true },
      },
      sector: true,
      district: true,
    },
  });

  if (!course) throw new Error('Course not found');

  // Fetch demanded skills in the same sector or district
  const jobSkills = await prisma.jobSkill.findMany({
    where: {
      job: {
        status: 'ACTIVE',
        ...(course.sectorId ? { sectorId: course.sectorId } : {}),
      },
    },
    include: { skill: true },
  });

  // Calculate frequency of each skill in active jobs
  const skillFrequency: Record<string, { count: number; name: string; id: string }> = {};
  for (const js of jobSkills) {
    if (!skillFrequency[js.skillId]) {
      skillFrequency[js.skillId] = { count: 0, name: js.skill.name, id: js.skill.id };
    }
    skillFrequency[js.skillId].count += 1;
  }

  const sortedDemandedSkills = Object.values(skillFrequency).sort((a, b) => b.count - a.count);
  const topDemanded = sortedDemandedSkills.slice(0, 10);

  const courseSkillIds = new Set(course.courseSkills.map((cs) => cs.skillId));
  const courseSkillNames = course.courseSkills.map((cs) => cs.skill.name);

  const covered: { name: string; count: number; id: string }[] = [];
  const missing: { name: string; count: number; id: string }[] = [];

  for (const dem of topDemanded) {
    if (courseSkillIds.has(dem.id)) {
      covered.push(dem);
    } else {
      missing.push(dem);
    }
  }

  const totalEvaluated = topDemanded.length || 1;
  const alignmentPercentage = Math.round((covered.length / totalEvaluated) * 100);

  return {
    course: {
      id: course.id,
      title: course.title,
      code: course.code,
      qualification: course.qualification,
      sector: course.sector?.name,
      district: course.district?.name,
    },
    alignmentPercentage,
    totalIndustrySkillsEvaluated: totalEvaluated,
    coveredSkillsCount: covered.length,
    missingSkillsCount: missing.length,
    coveredSkills: covered,
    missingSkills: missing,
    courseSkills: courseSkillNames,
    activeVacanciesInSector: jobSkills.length,
  };
}
