import createHttpError from 'http-errors';

import { findUser, signup } from '../services/auth.js';
import { compareHash } from '../utils/hash.js';
import { createSession, findSesion } from '../services/session-services.js';

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
    message: 'Successfully logged in an user!',
    data: { accessToken: newSession.accessToken },
  });
};
