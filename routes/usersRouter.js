import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { signupController } from '../controllers/usersControllers.js';
import { userSignupSchema } from '../validation/user-schemas.js';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);

export default authRouter;
