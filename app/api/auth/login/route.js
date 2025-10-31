// app/api/auth/login/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import dbConnect from '../../db/connect';
import User from '../../models/User.js';
import { generateToken } from '../../lib/auth';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Compare the password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT
    const token = generateToken(user);

    return NextResponse.json({ token, role: user.role, email: user.email }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}