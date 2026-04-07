const morgan = require('morgan');
const logger = require('../utils/auditLogger');

// Custom Morgan token to capture user email
morgan.token('userEmail', (req) => req.userEmail || 'Unauthenticated');

const morganFormat =
  ':userEmail :remote-addr :method :url :status :response-time ms :date[iso]';

// Middleware to log audit trail
const auditLoggerMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const parts = message.split(' ');
      const logObject = {
        userEmail: parts[0]?.trim(),
        ip: parts[1],
        method: parts[2],
        url: parts[3],
        status: parts[4],
        responseTime: parts[5] + ' ' + parts[6],
        dateTime: parts[7],
      };
      logger.info(JSON.stringify(logObject)); // Log to your logger
    },
  },
});

module.exports = auditLoggerMiddleware;
