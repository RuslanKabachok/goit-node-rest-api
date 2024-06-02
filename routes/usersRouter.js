import express from 'express';
import {
  register,
  login,
  logout,
  getCurrent,
} from '../controllers/usersControllers.js';
import authMiddleware from '../midlleware/auth.js';

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post('/register', jsonParser, register);
usersRouter.post('/login', jsonParser, login);
usersRouter.post('/logout', authMiddleware, logout);
usersRouter.get('/current', authMiddleware, getCurrent);

export default usersRouter;
