export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { calculateCourseAlignment } from '@/lib/skills-engine';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const alignment = await calculateCourseAlignment(params.id);
    return successResponse(alignment);
  } catch (err: any) {
    console.error('Course alignment calculation error:', err);
    return errorResponse(err.message || 'Failed to calculate course alignment', 'SERVER_ERROR', 500);
  }
}
