import express from 'express';
import {
  getAllContactsController,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contactsControllers.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = express.Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', createContact);

contactsRouter.put('/:id', updateContact);

contactsRouter.patch('/:id/favorite', updateStatusContact);

export default contactsRouter;
