import createHttpError from 'http-errors';
import { findSesion } from '../services/session-services';

const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Token must have Bearer type'));
  }

  if (!accessToken) {
    return next(createHttpError(401, 'Token missing'));
  }

  const session = await findSesion({ accessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }
};

export default authenticate;
