import log from '../logging/service';

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
  let errorObjects = [];
  errors.forEach(error => {
    let logLevel = log.getLogLevels().ERROR;
    if (error.name === 'ControlledError') {
      logLevel = error.logLevel;
      errorCodes.push(error.code);
    }
    errorObjects.push({ error: errorToObject(error), logLevel });
  });
  let data = {
    errors: errorCodes
  };
  res.status(statusCode).json(data);
  errorObjects.forEach( errorObject => {
    log.log(name, { error: errorObject.error }, res.req, res, errorObject.logLevel);
  });
}