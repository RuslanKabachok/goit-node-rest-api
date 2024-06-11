import express from 'express';
import {
  register,
  login,
  logout,
  getCurrent,
  uploadAvatar,
} from '../controllers/usersControllers.js';
import authMiddleware from '../midlleware/auth.js';
import uploadMiddleware from '../midlleware/upload.js';

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post('/register', jsonParser, register);
usersRouter.post('/login', jsonParser, login);
usersRouter.post('/logout', authMiddleware, logout);
usersRouter.get('/current', authMiddleware, getCurrent);
usersRouter.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  uploadAvatar
);

export default usersRouter;
