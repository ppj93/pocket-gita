exports.requestValidations = {
    requestBase: this.isRequestBaseValid,
    addAlbum: this.isAddAlbumRequestValid
};

this.isRequestBaseValid = function (requestBase) {
    return requestBase && requestBase.requestId;
};

this.isAddAlbumRequestValid = function (request) {
    return this.isRequestBaseValid(request.requestBase) &&
        request.album && request.album.name;
};