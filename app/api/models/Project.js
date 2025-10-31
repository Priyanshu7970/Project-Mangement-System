// models/Project.js

import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date,required:false,default:null },
  // Reference to User model using ObjectId
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export default Project;