import createHttpError from 'http-errors';

import {
  getContacts,
  getContactById,
  addContact,
  upsertContact,
  deleteContact,
} from '../services/contacts.js';

import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactFitlerParams from '../utils/parseContactFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import env from '../utils/env.js';

import { contactFieldList } from '../constants/contacts-constants.js';

export const getAllContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { query } = req;
  const { page, perPage } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, contactFieldList);
  const filter = { ...parseContactFitlerParams(query), userId };

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    contacts,
    status: 200,
    message: 'Successfully found contacts!',
  });
};

export const getOneContactController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const contactId = req.params.id;

  const contact = await getContactById({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({
    status: 200,
    contact,
    message: `Successfully found contact with id ${contactId}!`,
  });
};

export const deleteContactConroller = async (req, res) => {
  const contactId = req.params.id;
  const { _id: userId } = req.user;

  const contact = await deleteContact({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({
    status: 204,
  });
};

export const createContactController = async (req, res, next) => {
  const contactData = { ...req.body, userId: req.user._id };

  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
    contactData.photo = photoUrl;
  }

  const data = await addContact(contactData);

  res
    .status(201)
    .json({ status: 201, message: 'Successfully created a contact!', data });
};

export const updateContactContorller = async (req, res, next) => {
  const contactId = req.params.id;
  const { _id: userId } = req.user;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updateData = {
    ...req.body,
  };

  if (photoUrl) {
    updateData.photo = photoUrl;
  }

  const data = await upsertContact({ _id: contactId, userId }, updateData, {
    upsert: true,
  });

  const status = data.isNew ? 201 : 200;
  const message = data.isNew
    ? 'Contact success add'
    : 'Successfully patched a contact!';

  res.json({
    status,
    message,
    data: data.data,
  });
};
