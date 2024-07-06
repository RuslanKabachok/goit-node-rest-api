import Contact from '../db/models/Contact.js';

export const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};
