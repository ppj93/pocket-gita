var mongoUtil = require('../common/mongoUtil');
var mongoose = require('mongoose');

/** TODO: think of how to organize setup scripts & how / where to call them from */

var albumSchemaObj = {
    id: String,
    name: String,
    thumbnailUrl: String,
    trackIds: [String],
    nameInUrl: String,
    description: String
};


exports.registerModules = function () {
    mongoose.model('album', mongoose.Schema(albumSchemaObj));    
};