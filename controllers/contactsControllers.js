import contactsService from '../services/contactsServices.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';
import Contact from '../models/contact.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();

    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const contactId = req.params.id;

  try {
    const contact = await Contact.findById(contactId);
    if (contact === null) {
      return res.status(404).send('Book not found');
    }
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const result = await Contact.findByIdAndDelete(contactId);
    if (result === null) {
      return res.status(404).send('Book not found');
    }
    res.send(contactId);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { error } = createContactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    await Contact.create(contact);
    res.status(201).send('Success!');
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body);
  const contactId = req.params.id;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const result = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });

    if (result === null) {
      return res.status(404).send('Book not found');
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};
