import Contact from '../db/models/Contact.js';

import { contactFieldList } from '../constants/contacts-constants.js';
import { sortOrderList } from '../constants/index.js';
import calcPagnationData from '../utils/calcPaginationData.js';

export const getContacts = async ({
  filter,
  page,
  perPage,
  sortBy = contactFieldList[0],
  sortOrder = sortOrderList[0],
}) => {
  const skip = (page - 1) * perPage;

  const databaseQuery = Contact.find();

  if (filter.userId) {
    databaseQuery.where('userId').equals(filter.userId);
  }
  if (filter.type) {
    databaseQuery.where('type').equals(filter.type);
  }
  if (filter.favorite) {
    databaseQuery.where('favorite').equals(filter.favorite);
  }

  const items = await databaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const totalItems = await Contact.find().merge(databaseQuery).countDocuments();

  const { totalPages, hasNextPage, hasPrevPage } = calcPagnationData({
    total: totalItems,
    perPage,
    page,
  });

  return {
    items,
    totalItems,
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const addContact = async (data) => {
  const contact = await Contact.create(data);
  return contact;
};

export const upsertContact = async (filter, data, options = {}) => {
  const result = await Contact.findOneAndUpdate(filter, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result?.lastErrorObject?.upserted);

  return {
    data: result.value,
    isNew,
  };
};

export const deleteContact = (filter) => Contact.findOneAndDelete(filter);

// export const deleteContact = (filter) => {
//   const result = Contact.findOneAndDelete(filter);
//   console.log(result);
//   return result;
// };
