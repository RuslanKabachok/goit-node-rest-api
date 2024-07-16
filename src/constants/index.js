import path from 'path';

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;

export const REFRESH_TOKEN_LIFETIME = 7 * 24 * 3600 * 1000;

export const sortOrderList = ['asc', 'desc'];

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
