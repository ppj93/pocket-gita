var mongoUtil = require('../../common/mongoUtil');
var mongoose = require('mongoose');

var trackSchemaObj = {
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    album: {type: mongoose.Schema.Types.ObjectId, ref: 'album'},
    audioUrl: String
};

var trackSchema = mongoose.Schema(trackSchemaObj, { collection: 'track' });

trackSchema.index({ name: 'text' });

module.exports = mongoose.model('track', trackSchema);