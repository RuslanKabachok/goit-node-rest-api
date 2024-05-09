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

export const getOneContact = async (req, res) => {
  const contactId = req.params.id;
  const contact = await contactsService.getContactById(contactId);

  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  const contact = await contactsService.removeContact(contactId);

  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
};

export const createContact = async (req, res, next) => {
  // const { error } = createContactSchema.validate(req.body);

  // if (error) {
  //   return res.status(400).json({ message: error.message });
  // }

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

export const updateContact = async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: 'Body must have at least one field' });
  }

  const { id } = req.params;

  const updatedContact = await contactsService.updateContact(id, req.body);

  if (!updatedContact) {
    return res.status(404).json({ message: 'Not found' });
  }

  return res.status(200).json(updatedContact);
};
