export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { getAIProvider } from '@/ai';
import { successResponse, errorResponse } from '@/lib/response';
import { z } from 'zod';

const extractSchema = z.object({
  text: z.string().min(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = extractSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('Valid text content is required', 'VALIDATION_ERROR', 400);
    }

    const ai = getAIProvider();
    const analysis = await ai.analyzeJob(parsed.data.text);

    return successResponse({
      provider: ai.name,
      ...analysis,
    });
  } catch (err: any) {
    console.error('Skill extraction error:', err);
    return errorResponse('Failed to extract skills', 'AI_EXTRACTION_ERROR', 500);
  }
}
