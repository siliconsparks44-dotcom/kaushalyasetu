export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { getAIProvider } from '@/ai';
import { normalizeSkillName } from '@/lib/skills-engine';
import Papa from 'papaparse';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'EMPLOYER' && user.role !== 'ADMIN')) {
      return errorResponse('Unauthorized to import jobs', 'FORBIDDEN', 403);
    }

    const body = await req.json();
    const { csvContent } = body;
    if (!csvContent || typeof csvContent !== 'string') {
      return errorResponse('CSV text content is required', 'VALIDATION_ERROR', 400);
    }

    // Parse CSV
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseResult.errors && parseResult.errors.length > 0) {
      return errorResponse('Failed to parse CSV', 'CSV_PARSE_ERROR', 400, parseResult.errors);
    }

    const rows = parseResult.data as Record<string, string>[];
    if (rows.length === 0) {
      return errorResponse('No data rows found in CSV', 'EMPTY_CSV', 400);
    }

    let employerId = user.employerProfile?.id;
    if (!employerId && user.role === 'ADMIN') {
      const defaultEmp = await prisma.employer.findFirst();
      employerId = defaultEmp?.id;
    }

    if (!employerId) {
      return errorResponse('No employer profile linked to user', 'BAD_REQUEST', 400);
    }

    const ai = getAIProvider();
    let importedCount = 0;
    let duplicateCount = 0;

    for (const row of rows) {
      const title = row['job_title'] || row['title'] || 'Technical Specialist';
      const location = row['location'] || 'Regional Center';
      const description = row['description'] || `${title} position required in ${location}`;
      const experience = (row['experience'] || 'entry').toLowerCase();
      const education = row['education'] || 'Technical Qualification';
      const salaryMin = parseInt(row['salary_min'] || '0') || null;
      const salaryMax = parseInt(row['salary_max'] || '0') || null;

      // Duplicate detection
      const existing = await prisma.job.findFirst({
        where: {
          employerId,
          title,
          location,
          status: 'ACTIVE',
        },
      });

      if (existing) {
        duplicateCount++;
        continue;
      }

      const job = await prisma.job.create({
        data: {
          employerId,
          title,
          location,
          description,
          experienceLevel: ['entry', 'mid', 'senior', 'lead'].includes(experience) ? experience : 'entry',
          education,
          salaryMin,
          salaryMax,
          source: 'CSV_IMPORT',
          status: 'ACTIVE',
        },
      });

      // Extract skills from row['skills'] or AI analyze description
      let rawSkillsList: string[] = [];
      if (row['skills']) {
        rawSkillsList = row['skills'].split(',').map((s) => s.trim()).filter(Boolean);
      }

      if (rawSkillsList.length === 0) {
        const extracted = await ai.extractSkills(description + ' ' + title);
        rawSkillsList = extracted.map((e) => e.name);
      }

      for (const skillStr of rawSkillsList) {
        const normalized = await normalizeSkillName(skillStr);
        await prisma.jobSkill.create({
          data: {
            jobId: job.id,
            skillId: normalized.id,
            proficiency: 'intermediate',
            importance: 'required',
          },
        });
      }

      importedCount++;
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'JOBS_CSV_IMPORTED',
        entityType: 'JOB',
        detailsJson: JSON.stringify({ importedCount, duplicateCount, totalRows: rows.length }),
      },
    });

    return successResponse({
      importedCount,
      duplicateCount,
      totalRows: rows.length,
      message: `Successfully ingested ${importedCount} jobs (${duplicateCount} duplicates skipped)`,
    });
  } catch (err: any) {
    console.error('CSV import error:', err);
    return errorResponse(err.message || 'Failed to import CSV jobs', 'SERVER_ERROR', 500);
  }
}
