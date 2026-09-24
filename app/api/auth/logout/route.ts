export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { successResponse } from '@/lib/response';

export async function POST() {
  const response = successResponse({ message: 'Logged out successfully' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}
