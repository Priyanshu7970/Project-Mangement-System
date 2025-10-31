// app/api/middleware/auth.js

import { NextResponse } from 'next/server';
import { verifyToken } from '../lib/auth';

export function withAuth(handler) {
  return async (request, ...args) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    request.user = payload;
    
    return handler(request, ...args);
  };
}