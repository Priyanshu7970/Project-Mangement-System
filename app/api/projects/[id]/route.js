// app/api/projects/[id]/route.js
import { NextResponse } from 'next/server';;
import { Role } from '../../models/User';
import { withAuth } from '../../middleware/auth';
import Project from '../../models/Project';
import dbConnect from '../../db/connect';


// Helper to check ownership/admin status
async function checkAccess(projectId, userId, role) {
  if (role === Role.ADMIN) return true; // Admin has full access

  await dbConnect();
  const project = await Project.findById(projectId);
  console.log(project);
  return project?.assignedUser.toString() === userId;
}

// 1. Read Single Project (GET)
async function getProjectByIdHandler(req, {params}) {
  await dbConnect();
  const { userId, role } = req.user;
  const { id } = await params;

  if (!(await checkAccess(id, userId, role))) {
    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }

  const project = await Project.findById(id).populate('assignedUser', 'email');

  if (!project) {
    return NextResponse.json({ message: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project, { status: 200 });
}

// 2. Update Project (PUT)
async function updateProjectHandler(req,{params}) {
  await dbConnect();
  const { userId, role } = req.user;
  const {id} = await params;
  const updateData = await req.json();

  if (!(await checkAccess(id, userId, role))) {
    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  return NextResponse.json(updatedProject, { status: 200 });
}

// 3. Delete Project (DELETE)
async function deleteProjectHandler(req,{params}) {
  await dbConnect();
  const { userId, role } = req.user;
  const {id} = await params; 

  if (!(await checkAccess(id, userId, role))) {

    return NextResponse.json({ message: 'Forbidden: Access denied' }, { status: 403 });
  }

  await Project.findByIdAndDelete(id);

  return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
}

export const GET = withAuth(getProjectByIdHandler);
export const PUT = withAuth(updateProjectHandler);
export const DELETE = withAuth(deleteProjectHandler);