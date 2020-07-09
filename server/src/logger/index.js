import log4js from 'log4js';

const logger = (identifier) => {
  const logger = log4js.getLogger(identifier);
  logger.level = 'debug';
  return logger;
};

export default logger;