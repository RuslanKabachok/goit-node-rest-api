import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from '../schemas/contactsSchemas.js';
import Contact from '../models/contact.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });

    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const contactId = req.params.id;

  try {
    const contact = await Contact.findOne({
      _id: contactId,
      owner: req.user.id,
    });

    if (contact === null) {
      return res.status(404).send('Contact not found');
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: req.user.id,
    });

    if (result === null) {
      return res.status(404).send('Contact not found');
    }

    await Contact.findOneAndDelete({
      _id: contactId,
      owner: req.user.id,
    });

    res.status(200).send('Contact deleted successfully');
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
    owner: req.user.id,
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
    const result = await Contact.findOne({
      _id: contactId,
      owner: req.user.id,
    });

    if (result === null) {
      return res.status(404).send('Contact not found');
    }

    const updatedContact = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: req.user.id,
      },
      contact,
      {
        new: true,
      }
    );

    res.send(updatedContact);
  } catch (error) {
    next(error);
  }
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
      owner: req.user.id,
    });

    if (result === null) {
      return res.status(404).send('Not found');
    }

    const update = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: req.user.id,
      },
      favorite,
      {
        new: true,
      }
    );

    return res.status(200).json(update);
  } catch (error) {
    next(error);
  }
};
