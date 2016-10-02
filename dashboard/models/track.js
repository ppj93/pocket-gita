var mongoUtil = require('../../common/mongoUtil');
var mongoose = require('mongoose');

var trackSchemaObj = {
    id: String,
    name: String,
    album: {type: mongoose.Schema.Types.ObjectId, ref: 'album'},
    audioUrl: String
};

var trackSchema = mongoose.Schema(trackSchemaObj, { collection: 'track' });

module.exports = mongoose.model('track', trackSchema);