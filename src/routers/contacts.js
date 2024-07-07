import express from 'express';

import {
  getAllContactsController,
  getOneContactController,
  deleteContactConroller,
  createContactController,
  updateContactContorller,
} from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import isValidId from '../midlleware/isValidId.js';

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(getOneContactController));

contactsRouter.post('/', ctrlWrapper(createContactController));

contactsRouter.patch('/:id', ctrlWrapper(updateContactContorller));

contactsRouter.delete('/:id', ctrlWrapper(deleteContactConroller));

contactsRouter.put('/:id', updateContactContorller);

export default contactsRouter;
