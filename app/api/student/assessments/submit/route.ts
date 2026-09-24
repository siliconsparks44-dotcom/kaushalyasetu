export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const submitSchema = z.object({
  assessmentId: z.string(),
  answers: z.record(z.number()), // questionId -> selectedOptionIndex
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

    let studentId = user.studentProfile?.id;
    if (!studentId && user.role === 'ADMIN') {
      const firstStudent = await prisma.student.findFirst();
      studentId = firstStudent?.id;
    }

    if (!studentId) {
      return errorResponse('No student profile found', 'BAD_REQUEST', 400);
    }

    const body = await req.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Invalid submission format', 'VALIDATION_ERROR', 400);
    }

    const { assessmentId, answers } = parsed.data;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { questions: true, skill: true },
    });

    if (!assessment) return errorResponse('Assessment not found', 'NOT_FOUND', 404);

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    for (const q of assessment.questions) {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    }

    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
    const passed = scorePercent >= assessment.passingScore;

    const result = await prisma.assessmentResult.create({
      data: {
        studentId,
        assessmentId,
        score: scorePercent,
        passed,
      },
    });

    // If passed, verify and add skill to student profile
    if (passed && assessment.skill) {
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (student) {
        let skills: string[] = [];
        try {
          skills = student.extractedSkills ? JSON.parse(student.extractedSkills) : [];
        } catch (e) {}

        if (!skills.includes(assessment.skill.name)) {
          skills.push(assessment.skill.name);
          await prisma.student.update({
            where: { id: studentId },
            data: { extractedSkills: JSON.stringify(skills) },
          });
        }
      }
    }

    return successResponse({
      score: scorePercent,
      correctCount,
      totalQuestions,
      passed,
      passingScore: assessment.passingScore,
      skillEarned: passed ? assessment.skill.name : null,
      resultId: result.id,
    });
  } catch (err: any) {
    console.error('Assessment submit error:', err);
    return errorResponse('Failed to evaluate assessment', 'SERVER_ERROR', 500);
  }
}
