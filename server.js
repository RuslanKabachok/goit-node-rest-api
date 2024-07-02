import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import authRouter from './routes/usersRouter.js';

import notFoundHandler from './midlleware/notFoundHandler.js';
import errorHandler from './midlleware/errorHandler.js';

import env from './utils/env.js';

const port = env('PORT', '3000');

const startServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log(`Server running on ${port} PORT`));
};

export default startServer;
