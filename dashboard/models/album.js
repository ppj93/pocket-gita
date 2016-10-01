var mongoUtil = require('../common/mongoUtil');
var mongoose = require('mongoose');

var albumSchemaObj = {
    id: String,
    name: String,
    thumbnailUrl: String,
    tracks: [{type: mongoose.Schema.Types.ObjectId, ref: "track"}],
    nameInUrl: String,
    description: String
};

var albumSchema = mongoose.Schema(albumSchemaObj, { collection: 'album' });

module.exports = mongoose.model('album', albumSchema);