
import { NextResponse } from 'next/server';
import { withAuth } from '../middleware/auth';
import Project from '../models/Project';
import User, { Role } from '../models/User';
import dbConnect from '../db/connect';

async function dashboardHandler(req) {
  await dbConnect();
  const { role } = req.user;

  if (role !== Role.ADMIN) {
    return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    // 1. Total number of users
    const totalUsers = await User.countDocuments();

    // 2. Total number of projects
    const totalProjects = await Project.countDocuments();

    // 3. Projects per user count (MongoDB Aggregation Pipeline)
    const projectsPerUser = await Project.aggregate([
      {
        $group: {
          _id: '$assignedUser', // Group by assignedUser ID (ObjectId)
          count: { $sum: 1 },
        },
      },
      {
        $lookup: { // Join with the User collection
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails', // Flatten the userDetails array
      },
      {
        $project: { // Shape the final output
          _id: 0,
          userId: '$_id',
          email: '$userDetails.email',
          count: 1,
        },
      },
    ]);

    return NextResponse.json({
      totalUsers,
      totalProjects,
      projectsPerUserCount: projectsPerUser,
    }, { status: 200 });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ message: 'Internal Server Error during data aggregation' }, { status: 500 });
  }
}

export const GET = withAuth(dashboardHandler);