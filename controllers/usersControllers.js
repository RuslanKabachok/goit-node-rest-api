import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/users.js';

export const register = async (req, res, next) => {
  const { password, email } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).send({ message: 'Email in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: emailInLowerCase,
      password: passwordHash,
    });

    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
};
