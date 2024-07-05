import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import authRouter from './src/routers/auth.js';
// import contactsRouter from './src/routers/contactsRouter.js';

import notFoundHandler from './src/midlleware/notFoundHandler.js';
import errorHandler from './src/midlleware/errorHandler.js';

import env from './src/utils/env.js';

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
  app.use(cookieParser);
  app.use(express.json());

  app.use('/api/auth', authRouter);
  // app.use('/api/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log(`Server running on ${port} PORT`));
};

export default startServer;
