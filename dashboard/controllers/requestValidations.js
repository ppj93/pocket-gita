var operationResults = require('../../common/constants').operationResults;

var that = this;

this.isRequestBaseValid = function (requestBase) {
    return requestBase && requestBase.requestId;
};

this.validateGetTrackDetailsRequest = function (params, callback) {
    var requestBody = params.requestBody,
        result = null;
    
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!requestBody.id) {
        result = operationResults.trackOps.idEmpty;
    }

    result = result ? { result: result } : result;

    callback(result, params);
};

this.validateGetAlbumDetailsRequest = function (params, callback) {
    var requestBody = params.requestBody,
        result = null;
    
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!requestBody.id) {
        result = operationResults.albumOps.idEmpty;
    }

    result = result ? { result: result } : result;
    
    callback(result, params);
};

/*TODO: rename invalidRequest to invalidRequestBase */
this.validateEditTrackRequest = function (params, callback) {
    var requestBody = params.requestBody,
        result = null,
        track = requestBody.track;
    
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!track) {
        result = operationResults.trackOps.trackObjectEmpty;
    }
    else if (!track.id) {
        result = operationResults.trackOps.idEmpty;
    }
    else if (!track.name) {
        result = operationResults.trackOps.nameEmpty;
    }
    else if (!track.audioUrl) {
        result = operationResults.trackOps.audioUrlEmpty;
    }
    
    result = result ? { result: result } : result;
    
    //TODO: add audioUrl existance validation
    callback(result, params);
};

this.validateAddTrackRequest = function (params, callback) {
    var requestBody = params.requestBody,
        result = null,
        track = requestBody.track;
    
    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!track) {
        result = operationResults.trackOps.trackObjectEmpty;
    }
    else if (!track.id) {
        result = operationResults.trackOps.idEmpty;
    }
    else if (!track.name) {
        result = operationResults.trackOps.nameEmpty;
    }
    else if (!track.audioUrl) {
        result = operationResults.trackOps.audioUrlEmpty;
    }
    result = result ? { result: result } : result;
    
    callback(result, params);
};

this.validateRequestBase = function (params, callback) {
    var requestBase = params.requestBase,
        result = null;

    if (!requestBase || !requestBase.requestId) {
        result = operationResults.invalidRequest;
    }

    result = result ? { result: result } : result;
    
    callback(result, params);
};

/** TODO: Try moving to controller file + in built validations */
this.validateAddAlbumRequest = function (params, callback) {
    var requestBody = params.requestBody,
        result = null,
        album = requestBody.album;

    if (!that.isRequestBaseValid(requestBody.requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!album) {
        result = operationResults.albumOps.albumObjectEmpty;
    }
    else if (!album.id) {
        result = operationResults.albumOps.idEmpty;
    }
    else if (!album.name) {
        result = operationResults.albumOps.nameEmpty;
    }

    result = result ? { result: result } : result;
    
    callback(result, params);
};

this.validateEditAlbumRequest = function (params, callback) {
    var album = params.album,
        requestBase = params.requestBody.requestBase,
        result = null;
        
    if (!that.isRequestBaseValid(requestBase)) {
        result = operationResults.invalidRequest;
    }
    else if (!album) {
        result = operationResults.albumOps.albumObjectEmpty;
    }
    else if (!album.id) {
        result = operationResults.albumOps.idEmpty;
    }
    else if (!album.name) {
        result = operationResults.albumOps.nameEmpty;
    }

    result = result ? { result: result } : result;
    
    callback(result, params);
};