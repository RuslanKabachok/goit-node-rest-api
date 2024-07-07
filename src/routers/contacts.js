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

contactsRouter.get('/', authenticate, ctrlWrapper(getAllContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(getOneContactController));

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch('/:id', isValidId, ctrlWrapper(updateContactContorller));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactConroller));

// contactsRouter.put('/:id', updateContactContorller);

export default contactsRouter;
