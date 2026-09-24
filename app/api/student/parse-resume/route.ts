export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { getAIProvider } from '@/ai';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const resumeSchema = z.object({
  resumeText: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const parsed = resumeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Resume text (minimum 20 characters) is required', 'VALIDATION_ERROR', 400);
    }

    const ai = getAIProvider();
    const analysis = await ai.analyzeResume(parsed.data.resumeText);

    // If user is a student, update their profile with extracted skills and text
    if (user && user.studentProfile) {
      const skillNames = analysis.skills.map((s) => s.name);
      await prisma.student.update({
        where: { id: user.studentProfile.id },
        data: {
          resumeText: parsed.data.resumeText,
          extractedSkills: JSON.stringify(skillNames),
          educationLevel: analysis.educationLevel || user.studentProfile.educationLevel,
        },
      });
    }

    return successResponse({
      provider: ai.name,
      ...analysis,
    });
  } catch (err: any) {
    console.error('Resume parsing error:', err);
    return errorResponse('Failed to parse resume', 'AI_PARSE_ERROR', 500);
  }
}
