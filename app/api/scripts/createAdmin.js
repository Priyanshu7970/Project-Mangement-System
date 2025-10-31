
// Using require for environment variables as discussed
import * as dotenv from 'dotenv'
dotenv.config({ path: './.env.local' });

// FIX 1: Use relative path to access dbConnect in the root 'lib' directory

// FIX 2: Use relative path to access User model in the root 'models' directory
import User, { Role } from '../models/User.js'; 

import bcrypt from 'bcrypt';
import mongoose from 'mongoose'; // Added mongoose import for disconnect
import dbConnect from '../db/connect.js';

// --- Configuration ---
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createAdminUser() {
  if (!ADMIN_PASSWORD) {
    console.error("FATAL: ADMIN_PASSWORD environment variable is not set.");
    process.exit(1);
  }

  await dbConnect();
  
  try {
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists. Skipping creation.`);
      if (existingAdmin.role !== Role.ADMIN) {
        // Optional: Update existing user's role if it's incorrect
        existingAdmin.role = Role.ADMIN;
        await existingAdmin.save();
        console.log(`Updated existing user's role to ${Role.ADMIN}.`);
      }
      return;
    }

    // 1. Securely hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // 2. Create the user with the ADMIN role
    await User.create({
      email: ADMIN_EMAIL,
      password:passwordHash,
      role: Role.ADMIN, // Crucial step: manually set the ADMIN role
    });

    console.log(`✅ Successfully created Admin user: ${ADMIN_EMAIL}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    setTimeout(() => {
        if (mongoose.connection.readyState === 1) {
             mongoose.disconnect();
        }
    }, 100);
  }
}

// Ensure the script runs
createAdminUser();