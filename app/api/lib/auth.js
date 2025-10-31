// lib/auth.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret'; // Use a strong secret!

// 1. JWT Generation
export function generateToken(user) {
  const payload = {
    userId: user._id.toString(), // Use MongoDB's _id
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

// 2. JWT Verification
export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}