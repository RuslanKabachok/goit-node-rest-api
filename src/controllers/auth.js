import createHttpError from 'http-errors';

import {
  findUser,
  signup,
  requestResetToken,
  resetPassword,
  loginOrSignupWithGoogle,
} from '../services/auth.js';
import { compareHash } from '../utils/hash.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import {
  createSession,
  findSesion,
  deleteSession,
} from '../services/session-services.js';

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    hhtpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const signupController = async (req, res) => {
  const { email } = req.body;

  const user = await findUser({ email });

  if (user) {
    throw createHttpError(409, 'Email already in use');
  }
  const newUser = await signup(req.body);

  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    data,
    message: 'Successfully registered a user!',
  });
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(401, 'Email not found');
  }

  const comparePassword = await compareHash(password, user.password);

  if (!comparePassword) {
    throw createHttpError(401, 'Password is invalid');
  }

  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;

  const currentSession = await findSesion({ _id: sessionId, refreshToken });

  if (!currentSession) {
    throw createHttpError(401, 'Sesion not found');
  }

  const refreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }

  const newSession = await createSession(currentSession.userId);

  setupResponseSession(res, newSession);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newSession.accessToken },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }

  await deleteSession({ _id: sessionId });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204);
};

export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    createHttpError(500, 'Failed to send the email, please try again later.');
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: 'Google OAuth url generate successfully',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  createSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
