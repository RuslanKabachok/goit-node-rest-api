import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  signupController,
  signinController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';
import {
  userSignupSchema,
  userSigninSchema,
} from '../validation/user-schemas.js';

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

export default authRouter;
