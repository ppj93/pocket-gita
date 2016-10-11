var operationResults = require('../../common/constants').operationResults;

exports.requestValidations = {
    requestBase: this.isRequestBaseValid,
    addAlbum: this.isAddAlbumRequestValid
};

var that = this;

this.isRequestBaseValid = function (requestBase) {
    return requestBase && requestBase.requestId;
};

this.validateGetTrackDetailsRequest = function (requestBody, callback) {
    var result = null;
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!requestBody.id) {
        result = operationResults.trackOps.idEmpty;
    }

    callback(result);
};

this.validateGetAlbumDetailsRequest = function (requestBody, callback) {
    var result = null;
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!requestBody.id) {
        result = operationResults.albumOps.idEmpty;
    }

    callback(result);
};

/*TODO: rename invalidRequest to invalidRequestBase */
this.validateEditTrackRequest = function (requestBody, callback) {
    var result = null,
        track = requestBody.track;
    
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!track.id || track.id === undefined) {
        result = operationResults.trackOps.idEmpty;
    }
    else if (!track.name || track.name === undefined) {
        result = operationResults.trackOps.nameEmpty;
    }
    
    //TODO: add audioUrl existance validation
    callback(result);
};

this.validateAddTrackRequest = function (requestBody, callback) {
    var result = null,
        track = requestBody.track;
    
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!track.id || track.id === undefined) {
        result = operationResults.trackOps.idEmpty;
    }
    else if (!track.name || track.name === undefined) {
        result = operationResults.trackOps.nameEmpty;
    }
    else if (!track.audioUrl || track.audioUrl === undefined) {
        result = operationResults.trackOps.audioUrlEmpty;
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