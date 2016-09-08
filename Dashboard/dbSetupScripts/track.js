var mongoose = require('mongoose');

var trackSchema = mongoose.Schema({
    id: String,
    name: String,
    thumbnailUrl: String,
    transcript: String,
    audioUrl: String,
    length: Number
});