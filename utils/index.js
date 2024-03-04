const { buildDevLogger } = require('./logger');

let logger = null;

logger = buildDevLogger();

module.exports = { logger };
