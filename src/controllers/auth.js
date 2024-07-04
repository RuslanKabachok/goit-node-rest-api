import createHttpError from 'http-errors';

import { findUser, signup } from '../services/auth.js';
import { compareHash } from '../utils/hash.js';
import { createSession } from '../services/session-services.js';

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

  const { accessToken, refreshToken, _id, refreshTokenValidUntil } =
    await createSession(user._id);

  res.cookie('refreshToken', refreshToken, {
    hhtpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: accessToken },
  });
};
