import express from 'express';

import {
  getAllContactsController,
  getOneContactController,
  deleteContactConroller,
  createContactController,
  updateContactContorller,
} from '../controllers/contacts.js';

import { createContactSchema } from '../schemas/contactsSchemas.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../midlleware/isValidId.js';
import validateBody from '../utils/validateBody.js';
import authenticate from '../midlleware/authenticate.js';

const contactsRouter = express.Router();

contactsRouter.get(
  '/contacts',
  authenticate,
  ctrlWrapper(getAllContactsController),
);

contactsRouter.get(
  '/contacts/:id',
  authenticate,
  isValidId,
  ctrlWrapper(getOneContactController),
);

contactsRouter.post(
  '/contacts',
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  authenticate,
  isValidId,
  ctrlWrapper(updateContactContorller),
);

contactsRouter.delete(
  '/contacts/:id',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContactConroller),
);

export default contactsRouter;
