const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (!['true', 'false'].includes(value)) return;

  return value === 'true';
};

const parseContactFitlerParams = ({ favorite }) => {
  const parsedFavorite = parseBoolean(favorite);

  return {
    favorite: parsedFavorite,
  };
};

export default parseContactFitlerParams;
