import {
  getContacts,
  getContactById,
  addContact,
  upsertContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getAllContactsController = async (req, res) => {
  const contacts = await getContacts();
  console.log(contacts);
  res.json({
    contacts,
    status: 200,
    message: 'Successfully found contacts!',
  });
};

export const getOneContactController = async (req, res, next) => {
  const contactId = req.params.id;

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact not found`);
  }

  res.json({
    status: 200,
    contact,
    message: `Successfully found contact with id ${contactId}!`,
  });
};

export const deleteContactConroller = async (req, res) => {
  const contactId = req.params.id;

  const contact = await deleteContact({ _id: contactId });

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 204,
    message: 'Delete contact success',
  });
};

export const createContactController = async (req, res, next) => {
  const contactData = { ...req.body, userId: new mongoose.Types.ObjectId() };

  const data = await addContact(contactData);

  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a contact!', data });
};

export const updateContactContorller = async (req, res, next) => {
  const contactId = req.params.id;

  const data = await upsertContact({ _id: contactId }, req.body, {
    upsert: true,
  });

  const status = data.isNew ? 201 : 200;
  const message = data.isNew
    ? 'Contact success add'
    : 'Successfully patched a contact!';

  res.json({
    status,
    message,
    data: data.value,
  });
};
