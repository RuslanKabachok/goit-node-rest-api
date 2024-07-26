import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';

import notFoundHandler from './midlleware/notFoundHandler.js';
import errorHandler from './midlleware/errorHandler.js';
import { swaggerDocs } from '../src/midlleware/swaggerDocs.js';

import env from './utils/env.js';

import { UPLOAD_DIR } from './constants/index.js';

const port = env('PORT', '3000');

const setupServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(authRouter);
  app.use(contactsRouter);
  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.use(express.static(UPLOAD_DIR));

  app.listen(port, () => console.log(`Server running on ${port} PORT`));
};

export default setupServer;
