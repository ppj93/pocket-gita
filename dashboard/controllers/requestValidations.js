var operationResults = require('../../common/constants').operationResults;

exports.requestValidations = {
    requestBase: this.isRequestBaseValid,
    addAlbum: this.isAddAlbumRequestValid
};

this.isRequestBaseValid = function (requestBase) {
    return requestBase && requestBase.requestId;
};

this.validateRequestBase = function (requestBase, extras, callback) {
    if (!requestBase || !requestBase.requestId) {
        callback({
            result: operationResults.invalidRequest
        });
        return;
    }
    callback(null, extras);
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