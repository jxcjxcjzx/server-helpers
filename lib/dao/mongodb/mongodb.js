var Q = require('q'),
    util = require('util'),
    mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var config = require('./config.js'),
    pool = require('../../pool.js');

var factory = pool.create('mongodb'),
    factories = {};

function create(settings, callback){
    var uri = util.format('mongodb://%s:%s/%s%s', settings.host, settings.port, settings.prefix, settings.dbname);
    MongoClient.connect(uri, { server: { 'poolSize': 1 } }, callback);
}

function destroy(db){
    if(db && db.close){
        db.close();
    }
}

function connect(dbname){
    var deferred = Q.defer();
    var conf = config.getConfig();
    if(conf && conf.host && conf.port && conf.prefix){
        var max = conf.max || 1,
            min = conf.min || 0;
        if(!factories.hasOwnProperty(dbname)){
            var settings = { 
                dbname: dbname,
                host: conf.host,
                port: conf.port,
                prefix: conf.prefix
            };
            factories[dbname] = factory.create(dbname, create, destroy, settings, max, min);
        }
        factories[dbname].acquire(function(err, db) {
          if(err){
            deferred.reject(err);
          }
          deferred.resolve(db);
        });
    }else{
        deferred.reject(new Error('db config err'));
    }
    return deferred.promise;
}

function release(dbname, db){
    if(factories.hasOwnProperty(dbname) && factories[dbname]){
        var pool = factories[dbname];
        if(pool && pool.release){
            pool.release(db);
        }
    }
}

module.exports = {
    config: config,
    connect: connect,
    release: release
};