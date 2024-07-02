import mongoose from 'mongoose';

import emailRegexp from '../constants/user-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.post('save', mongooseSaveError);

userSchema.pre('findOneAndUpdate', setUpdateSettings);

userSchema.post('findOneAndUpdate', mongooseSaveError);

export default mongoose.model('User', userSchema);
