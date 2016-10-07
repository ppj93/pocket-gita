var mongoUtil = require('../../common/mongoUtil');
var mongoose = require('mongoose');

var albumSchemaObj = {
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    thumbnailUrl: String,
    tracks: [{type: mongoose.Schema.Types.ObjectId, ref: "track"}],
    description: String
};

var albumSchema = mongoose.Schema(albumSchemaObj, { collection: 'album' });

albumSchema.index({ name: 'text' });

module.exports = mongoose.model('album', albumSchema);