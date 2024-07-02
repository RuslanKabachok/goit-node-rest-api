import createHttpError from 'http-errors';

import { findUser, signup } from '../services/auth-services.js';

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
    message: 'User signup successfuly',
  });
};
