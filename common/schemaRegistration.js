var mongoUtil = require('../common/mongoUtil');
var mongoose = require('mongoose');

/** TODO: think of how to organize setup scripts & how / where to call them from */

var albumSchemaObj = {
    id: String,
    name: String,
    thumbnailUrl: String,
    tracks: [{type: mongoose.Schema.Types.ObjectId, ref: "track"}],
    nameInUrl: String,
    description: String
};

var trackSchemaObj = {
    id: String,
    name: String,
    album: {type: mongoose.Schema.Types.ObjectId, ref: 'album'},
    nameInUrl: String,
    audioUrl: String
};

exports.registerModules = function () {
    mongoose.model('track', mongoose.Schema(trackSchemaObj, {collection: 'track'}));    
    mongoose.model('album', mongoose.Schema(albumSchemaObj, {collection: 'album'}));    
};