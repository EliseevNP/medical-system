import { errorToObject } from '../utils/routes';
import { handleErrors } from '../utils/routes';
import ControlledError from '../utils/controlledError';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';
import uuidv4 from 'uuidv4';

export default async function authenticationMiddleware(req, res, next) {
  try {
    if (!uuidv4.is(req.cookies.authorization)) {
      let error = new ControlledError(errors.NOT_AUTHORIZED, log.getLogLevels().WARNING, { description: 'The authorization cookie format is different from uuidv4' });
      handleErrors('AUTHORIZATION_MIDDLEWARE', [error], res, 401);
      return;
    }
    let authorization = await models.authorization.findOne({ where: { id: req.cookies.authorization } });
    if (!authorization) {
      let error = new ControlledError(errors.NOT_AUTHORIZED, log.getLogLevels().WARNING, { description: 'The authorization token is not found' });
      handleErrors('AUTHORIZATION_MIDDLEWARE', [error], res, 401);
      return;
    }
    let user = await models.user.findOne({ where: { id: authorization.userId }});
    if (!user) {
      let error = new ControlledError(errors.NOT_AUTHORIZED, log.getLogLevels().WARNING, { description: 'User is not found' });
      handleErrors('AUTHORIZATION_MIDDLEWARE', [error], res, 401);
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(500);
    log.error('AUTHORIZATION_MIDDLEWARE', { error: errorToObject(err) }, req, res);
  }
}