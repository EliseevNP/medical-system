class ControlledError extends Error {
  constructor(code, logLevel, data) {
    super(`Controlled error caught. Code number: ${code}. Error level: ${logLevel}. Data: ${data}`);
    this.name = 'ControlledError';
    this.code = code;
    this.logLevel = logLevel;
    this.data = data;
  }
}

export default ControlledError;