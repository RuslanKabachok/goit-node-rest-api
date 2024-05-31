import bcrypt from 'bcrypt';

import User from '../models/users.js';
import { registerUserSchema } from '../schemas/usersSchemas.js';
import { token } from 'morgan';

export const register = async (req, res, next) => {
  const { password, email } = req.body;

  const { error } = registerUserSchema.validate({ password, email });

  if (error) {
    return res.status(400).json({ message: error.message });
  }
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

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    res.send({ token: 'TOKEN' });
  } catch (error) {
    next(error);
  }
};
