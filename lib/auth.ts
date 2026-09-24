import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = process.env.AUTH_SECRET || 'fallback-secret-lmi-platform-dev-2026';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  fullName: string;
  organizationId?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest) {
  let token: string | null = null;

  // 1. Check Authorization Bearer header
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Check Cookie if header is missing
  if (!token) {
    const cookie = req.cookies.get('auth_token');
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      employerProfile: true,
      instituteProfile: true,
      trainerProfile: true,
      studentProfile: true,
      organization: true,
    },
  });

  if (!user || user.accountStatus !== 'ACTIVE') return null;

  return user;
}

export function requireRole(allowedRoles: string[]) {
  return async (req: NextRequest) => {
    const user = await getUserFromRequest(req);
    if (!user) {
      return { authorized: false, error: 'Unauthorized: Authentication required', status: 401, user: null };
    }
    if (!allowedRoles.includes(user.role)) {
      return { authorized: false, error: `Forbidden: Role '${user.role}' lacks permission`, status: 403, user };
    }
    return { authorized: true, error: null, status: 200, user };
  };
}
