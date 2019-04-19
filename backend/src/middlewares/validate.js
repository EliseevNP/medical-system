import { errorToObject } from '../utils/routes';
import { handleErrors } from '../utils/routes';
import ControlledError from '../utils/controlledError';
import log from '../logging/service';
import validate from 'validate.js';

export default function validationMiddleware(req, res, next) {
  try {
    let bodyValidationResult = validate(req.body, req.bodyConstraints);
    let paramsValidationResult = validate(req.params, req.paramsConstraints);
    let queryValidationResult = validate(req.query, req.queryConstraints);

    let validationObjects = [];
    if (bodyValidationResult) validationObjects = validationObjects.concat(bodyValidationResult);
    if (paramsValidationResult) validationObjects = validationObjects.concat(paramsValidationResult);
    if (queryValidationResult) validationObjects = validationObjects.concat(queryValidationResult);

    let errorCodes = [];
    for (let i = 0; i < validationObjects.length; i++) {
      for (let key in validationObjects[i]) {
        errorCodes.push(new ControlledError(validationObjects[i][key][0], log.getLogLevels().WARNING));
      }
    }

    if (errorCodes.length !== 0) {
      handleErrors('VALIDATION_MIDDLEWARE', errorCodes, res, 400);
    } else {
      next();
    }
  } catch (err) {
    res.sendStatus(500);
    log.error('VALIDATION_MIDDLEWARE', { error: errorToObject(err) }, req, res);
  }
}