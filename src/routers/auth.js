import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  signupController,
  signinController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';
import { requestResetEmailController } from '../controllers/auth.js';
import {
  userSignupSchema,
  userSigninSchema,
} from '../validation/user-schemas.js';
import { requestResetEmailSchema } from '../validation/auth.js';

const authRouter = express.Router();

authRouter.post(
  '/auth/register',
  validateBody(userSignupSchema),
  ctrlWrapper(signupController),
);

authRouter.post(
  '/auth/login',
  validateBody(userSigninSchema),
  ctrlWrapper(signinController),
);

authRouter.post('/auth/refresh', ctrlWrapper(refreshController));

authRouter.post('/auth/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/auth/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

export default authRouter;
