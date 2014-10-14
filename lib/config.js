var fs = require('fs'),
    path = require('path');

function Config(path){
    this.path = path;
    this.configDir = '';
    this.config = null;
}
Config.prototype.setConfigDir = function(dir) {
    this.configDir = dir;
};
Config.prototype.getConfig = function() {
    if(!this.config){
        this.config = require(path.join(this.configDir, this.path));
    }
    return this.config;
};
Config.prototype.save = function() {
    if(!!this.config && !!this.configDir){
        var data = JSON.stringify(this.config, null, '\t');
        fs.writeFile(path.join(this.configDir, this.path), data, function(){});
    }
};

module.exports = {
    createConfig: function(path){
        return new Config(path);
    }
};