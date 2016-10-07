var operationResults = require('../../common/constants').operationResults;

exports.requestValidations = {
    requestBase: this.isRequestBaseValid,
    addAlbum: this.isAddAlbumRequestValid
};

var that = this;

this.isRequestBaseValid = function (requestBase) {
    return requestBase && requestBase.requestId;
};

this.validateTrackObject = function (track, callback) {
    var result = null;
    if (!track.id || track.id === undefined) {
        result = operationResults.trackOps.trackIdEmpty;
    }
    else if (!track.name || track.name === undefined) {
        result = operationResults.trackOps.trackNameEmpty;
    }
    callback(result);
};

this.validateAlbumObject = function (album, callback) {
    var result = null;
    if (!album.id | album.id === undefined) {
        result = operationResults.albumOps.idEmpty;
    }
    else if (!album.name || album.name === undefined) {
        result = operationResults.albumOps.nameEmpty;
    }
    callback(result);
};

this.validateRequestBase = function (requestBase, callback) {
    if (!requestBase || !requestBase.requestId) {
        callback({
            result: operationResults.invalidRequest
        });
        return;
    }
    callback(null);
};

/** TODO: Try moving to controller file + in built validations */
this.isAddAlbumRequestValid = function (request) {
    return this.isRequestBaseValid(request.requestBase) &&
        request.album && request.album.name;
};

/** TODO: Try moving to controller file + in built validations */
this.isEditAlbumRequestValid = function (request) {
    return this.isRequestBaseValid(request.requestBase) &&
        request.album && request.album.name;
};