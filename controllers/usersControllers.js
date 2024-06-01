import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/users.js';
import { userSchema } from '../schemas/usersSchemas.js';

export const register = async (req, res, next) => {
  const { password, email } = req.body;

  const { error } = userSchema.validate({ password, email });

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

    const token = jwt.sign(
      {
        id: user._id,
        password: user.password,
      },
      process.env.JWT_SECRET,
      { expiresIn: '10h' }
    );

    res.send({ token });
  } catch (error) {
    next(error);
  }
};
