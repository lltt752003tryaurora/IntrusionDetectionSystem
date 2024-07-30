const yaml_config = require('node-yaml-config');

const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const config = yaml_config.load('config/config.yaml', ENVIRONMENT);

module.exports = config;