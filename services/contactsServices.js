import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const contactsPath = path.resolve('db', 'contacts.json');

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, {
    encoding: 'utf-8',
  });
  return JSON.parse(contacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === 'undefined') {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }
  const removedContact = contacts[index];
  contacts.splice(index, 1);

  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    name,
    email,
    phone,
    id: crypto.randomUUID(),
  };

  contacts.push(newContact);

  return newContact;
}

async function updateContact(contactId, updateData) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  Object.assign(contacts[index], updateData);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
