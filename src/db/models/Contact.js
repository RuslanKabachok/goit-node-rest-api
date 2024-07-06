import mongoose from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

contactSchema.post('save', mongooseSaveError);

contactSchema.pre('findOneAndUpdate', setUpdateSettings);

contactSchema.post('findOneAndUpdate', mongooseSaveError);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
