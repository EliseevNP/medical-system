import ControlledError from '../utils/controlledError';
import errors from '../../config/errors';
import log from '../logging/service';
import models from '../models';

export function errorToObject (error) {
  return {
    message: error.message,
    columnNumber: error.columnNumber,
    fileName: error.fileName,
    lineNumber: error.lineNumber,
    name: error.name,
    stack: error.stack
  };
}

export function handleErrors (name, errors, res, statusCode) {
  let errorCodes = [];
  errors.forEach(error => {
    let logLevel = log.getLogLevels().ERROR;
    if (error.name === 'ControlledError') {
      logLevel = error.logLevel;
      errorCodes.push(error.code);
    }
    log.log(name, { error: errorToObject(error) }, res.req, res, logLevel);
  });
  let data = {
    errors: errorCodes
  };
  res.status(statusCode).json(data);
}