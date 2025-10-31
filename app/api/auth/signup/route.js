// app/api/auth/signup/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '../../db/connect';
import { generateToken } from '../../lib/auth';
import User,{Role} from '../../models/User';

export async function POST(request) {
  await dbConnect();
  try {
    const { email, password } = await request.json(); 

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Securely hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password:passwordHash,
      role: Role.USER, // Default role
    });

    const token = generateToken(user);
    return NextResponse.json({ token, role: user.role, email: user.email }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}