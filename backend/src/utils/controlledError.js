class ControlledError extends Error {
  constructor(code, logLevel, data) {
    data = (data) ? JSON.stringify(data, null, 6).replace(/"/g, '\'') : data;
    super(`Controlled error caught. Code number: ${code}. Error level: ${logLevel}. Data: ${data}`);
    this.name = 'ControlledError';
    this.code = code;
    this.logLevel = logLevel;
    this.data = data;
  }
}

export default ControlledError;