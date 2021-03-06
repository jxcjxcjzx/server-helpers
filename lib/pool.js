var pool = require('generic-pool');
var util = require('./util.js');
var separator = '_';

function PoolFactory(name){
    this.name = name || ['pool', 'factory', util.createGUID()].join(separator);
}
PoolFactory.prototype = {
    create: function(name, create, destroy, settings, max, min){
        name = name || ['pool', util.createGUID()].join(separator);
        create = create || function(){};
        destroy = destroy || function(){};
        max = max || 1;
        min = min || 0;
        return pool.Pool({
            name     : [this.name, name].join('-'),
            create   : function(callback) {
                create(settings, callback);
            },
            destroy  : destroy,
            max      : max,
            // optional. if you set this, make sure to drain() (see step 3)
            min      : min, 
            // specifies how long a resource can stay idle in pool before being removed
            idleTimeoutMillis : 30000,
             // if true, logs via console.log - can also be a function
            log : false 
        });
    }
};

function createPoolFactory(name){
    return new PoolFactory(name);
}

module.exports = {
    createPoolFactory: createPoolFactory
};