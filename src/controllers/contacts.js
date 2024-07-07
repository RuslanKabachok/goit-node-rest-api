import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';
import Contact from '../db/models/Contact.js';
import {
  getContacts,
  getContactById,
  addContact,
  upsertContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

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
    message: `Successfully found contact with id {contactId}!`,
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
  const data = await addContact(req.body);

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

export const updateStatusContact = async (req, res, next) => {
  const { error } = updateFavoriteSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contactId = req.params.id;

  const favorite = { favorite: req.body.favorite };

  try {
    const result = await Contact.findOne({
      _id: contactId,
      userId: req.user.id,
    });

    if (result === null) {
      return res.status(404).send('Not found');
    }

    const update = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        userId: req.user.id,
      },
      favorite,
      {
        new: true,
      },
    );

    return res.status(200).json(update);
  } catch (error) {
    next(error);
  }
};
