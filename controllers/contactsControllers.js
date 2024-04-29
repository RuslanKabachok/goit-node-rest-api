import contactsService from '../services/contactsServices.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res) => {
  const contactList = await contactsService.listContacts();

  res.status(200).json(contactList);
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

export const createContact = async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  const { name, email, phone } = req.body;

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const newContact = await contactsService.addContact(name, email, phone);
  return res.status(201).json(newContact);
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
