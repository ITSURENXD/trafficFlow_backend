const { format, createLogger, transports } = require('winston');
const { timestamp, combine, printf, errors } = format;
const expressWinston = require('express-winston');

// logger display format.
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// development logger method
function buildDevLogger() {
  return createLogger({
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [new transports.Console()],
  });
}

// http logger method.
function httpLogger(logger) {
  return expressWinston.logger({
    winstonInstance: logger,
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
      errors({ stack: true }),
      logFormat
    ),
    meta: false, // Do not log metadata (default is true)
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
  });
}

module.exports = { buildDevLogger, httpLogger };
