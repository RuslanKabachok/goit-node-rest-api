import mongoose, { Schema } from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

sessionSchema.post('save', mongooseSaveError);

sessionSchema.pre('findOneAndUpdate', setUpdateSettings);

sessionSchema.post('findOneAndUpdate', mongooseSaveError);

export default mongoose.model('Session', sessionSchema);
