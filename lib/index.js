var util = require('./util.js'),
    pool = require('./pool.js'),
    config = require('./config.js'),
    redis = require('./dao/redis/redis.js'),
    mongodb = require('./dao/mongodb/mongodb.js');

module.exports = {
    createGUID: util.createGUID,
    createConfig: config.createConfig,
    createPoolFactory: pool.createPoolFactory,
    redis: redis,
    mongodb: mongodb
};