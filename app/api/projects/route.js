
import { NextResponse } from 'next/server';
import dbConnect from '../db/connect';
import { Role } from '../models/User';
import { withAuth } from '../middleware/auth';
import Project from '../models/Project';
import { parseDDMMYYYY } from '../lib/dateUtils';
// 1. Create Project (POST)
async function createProjectHandler(req) {
  await dbConnect();
  const { userId } = req.user;
  const { title, description, deadline } = await req.json();
  console.log(deadline);

  if (!title) {
    return NextResponse.json({ message: 'Title is required' }, { status: 400 });
  }
  const finalDeadline = parseDDMMYYYY(deadline);
  if (deadline && finalDeadline === null) {
      throw new Error("Invalid date format provided for the deadline. Must be DD/MM/YYYY.");
  }
 
  const project = await Project.create({
    title,
    description,
    deadline: new Date(finalDeadline),
    assignedUser: userId, // MongoDB _id from the JWT payload
  });

  return NextResponse.json(project, { status: 201 });
}

// 2. Read Projects (GET) - RBAC applied
async function getProjectsHandler(req) {
  await dbConnect();
  const { userId, role } = req.user;

  let query = {};
  if (role !== Role.ADMIN) {
    // Normal users can only see their own projects
    query.assignedUser = userId;
  }

  // Use .populate() to include the assigned user's details
  const projects = await Project.find(query)
    .populate('assignedUser', 'email role')
    .sort({ createdAt: -1 });

  return NextResponse.json(projects, { status: 200 });
}

export const POST = withAuth(createProjectHandler);
export const GET = withAuth(getProjectsHandler);