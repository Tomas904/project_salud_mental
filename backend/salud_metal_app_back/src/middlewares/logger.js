const morgan = require('morgan');
const config = require('../config/env');

const logger = morgan(
  config.env === 'development' 
    ? 'dev' 
    : 'combined'
);

module.exports = logger;