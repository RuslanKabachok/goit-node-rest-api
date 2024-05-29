import express from 'express';
import { register } from '../controllers/usersControllers.js';

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post('/register', jsonParser, register);

export default usersRouter;
