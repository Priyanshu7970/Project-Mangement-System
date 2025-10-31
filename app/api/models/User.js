// models/User.js

import mongoose from 'mongoose'; 



export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), default: Role.USER },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;