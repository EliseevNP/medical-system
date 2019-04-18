import process from 'process';
import loggingCfg from '../../config/logging';

const logLevels = {
  TRACE: 'trace',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};
const logLevelNumbers = {
  trace: 0,
  warning: 1,
  error: 2,
  critical: 3
};
const colorPrefixes = {
  trace: '\x1b[37m%s\x1b[0m',
  warning: '\x1b[33m%s\x1b[0m',
  error: '\x1b[95m%s\x1b[0m',
  critical: '\x1b[91m%s\x1b[0m'
};
let logLevel;

function send (name, data, req, res) {
  if (process.env.NODE_ENV === 'test' || logLevelNumbers[data.level] < logLevelNumbers[logLevel]) {
    return;
  }

  if (req) {
    let request = {};
    request.body = req.body;
    request.method = req.method;
    request.headers = req.headers;
    request.originalUrl = req.originalUrl;
    request.params = req.params;
    request.query = req.query;
    data.request = request;
  }

  if (res) {
    let response = {};
    response.body = res.body;
    response.headers = res.headers;
    response.query = res.query;
    response.statusMessage = res.statusMessage;
    response.statusCode = res.statusCode;
    data.response = response;
  }

  if (data.isShort) {
    console.log(`${colorPrefixes[data.level]}`, `[${name}][${data.level}] ${data.message}`);
  } else {
    console.log(`${colorPrefixes[data.level]}`, `[${name}][${data.level}] ${JSON.stringify(data, null, 2).replace(/\\n/g, '\n')}`);
  }
}

class LoggingService {
  constructor (level) {
    logLevel = level;
  }

  trace (name, data, req, res) {
    data.level = logLevels.TRACE;
    send(name, data, req, res);
  }

  warning (name, data, req, res) {
    data.level = logLevels.WARNING;
    send(name, data, req, res);
  }

  error (name, data, req, res) {
    data.level = logLevels.ERROR;
    send(name, data, req, res);
  }

  critical (name, data, req, res) {
    data.level = logLevels.CRITICAL;
    send(name, data, req, res);
  }

  log (name, data, req, res, logLevel) {
    switch (logLevel) {
      case logLevels.TRACE:
        this.trace(name, data, req, res);
        break;
      case logLevels.WARNING:
        this.warning(name, data, req, res);
        break;
      case logLevels.ERROR:
        this.error(name, data, req, res);
        break;
      case logLevels.CRITICAL:
        this.critical(name, data, req, res);
        break;
      default:
        break;
    }
  }

  getLogLevels () {
    return logLevels;
  }
}

export default new LoggingService(process.env.LOG_LEVEL || loggingCfg.logLevel);
