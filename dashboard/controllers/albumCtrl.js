'use strict';
 
var operationResults = require('../../common/constants').operationResults,
    appConfig = require('../config').appConfig,
    albumModel = require('../models/album'),
    requestValidations = require('./requestValidations'),
    _ = require('underscore'),
    async = require('async'),
    utilities = require('../../common/utilities'),
    trackModel = require('../models/track');

var getTrackIds = function (newAlbum, extras, callback) {
    if (!newAlbum.trackIds || newAlbum.trackIds.length === 0) {
        callback(null, newAlbum, [], extras);
        return; 
    }

    trackModel.find({ id: { $in: newAlbum.trackIds } })
        .lean()
        .select('_id id')
        .exec(function (error, tracks) {
            if (error) {
                callback({
                    result: operationResults.problemConnectingToDb
                });
                return;
            }

            callback(null, newAlbum, tracks, extras);
        });
};
        
var checkTrackIdValidity = function (newAlbum, tracks, extras, callback) {
    var foundErroneousTrackId = false;
    _.each(newAlbum.trackIds, function (trackId) {
        if (!_.some(tracks, function (track) { return track.id === trackId; })) {
            foundErroneousTrackId = true;
            callback({
                result: operationResults.albumOps.trackIdBeingAddedNotFound
            });
        }
    });

    if (!foundErroneousTrackId) {
        callback(null, newAlbum, tracks, extras);
    }
};

module.exports = {
    registerRoutes: function (app) {
        app.post('/getAlbums', this.getAlbums);
        app.post('/addAlbum', this.addAlbum);
        app.post('/editAlbum', this.editAlbum);
        app.post('/searchAlbumByName', this.searchAlbumByName);
        app.post('/getAlbumDetails', this.getAlbumDetails);
    },
    
    getAlbumDetails: function (request, response) {
        var albumId = request.body.id;

        var executeGetAlbumDetails = function (callback) {
            albumModel.findOne({ id: albumId })
                .lean()
                .populate({ path: 'tracks', select: 'id name'})
                .exec(function (error, dbAlbum) {
                    if (error) {
                        callback({
                            result: operationResults.dbOperationFailed
                        });
                        return;
                    }

                    callback(null, {
                        result: operationResults.success,
                        album: dbAlbum 
                    });
                });
        };
        async.waterfall([
            async.constant(request.body),
            requestValidations.validateGetAlbumDetailsRequest,
            executeGetAlbumDetails
        ],
            utilities.getUiJsonResponseSender(response)
        );
    },

    searchAlbumByName: function (request, response) {
        var searchText = request.body.searchText;
    
        var getResultAlbums = function (callback) {
            albumModel.find({ $text: { $search: searchText } })
                .lean()
                .select('id name')
                .exec(function (error, albums) { 
                    if (error) {
                        callback({
                            result: operationResults.dbOperationFailed
                        });
                        return;
                    }
                    callback(null, {
                        result: operationResults.success,
                        albums: albums
                    });
                });
        };

        /**Always write below line after defining functions you want to use. Else functions will come as undefined */
        async.waterfall([
            getResultAlbums
        ],
            utilities.getUiJsonResponseSender(response)
        );        

    },

    getAlbums: function (request, response) {
        var reqBody = request.body;

        if (!requestValidations.isRequestBaseValid(reqBody.requestBase)) {
            response.json({
                result: operationResults.invalidRequest
            });
            return;
        }
        
        //TODO: implement pagination!!
        var pageSize = reqBody.pageSize || appConfig.pageSize;
        var pageNumber = reqBody.pageNumber || 1;
        

        var execGetAlbums = function (callback) {
            /**We are connected to db. ready to fetch albums */
            albumModel.find({})
                .lean()
                .select('id name')
                .exec(function (error, albums) {
                    if (error) {
                        callback({
                            result: operationResults.dbOperationFailed
                        });
                        return;
                    }

                    var albumListViewModel = _.map(albums, function (album) { 
                        return {
                            id: album.id,
                            name: album.name,
                            thumbnailUrl: album.thumbnailUrl
                        };
                    });

                    callback(null, {
                        result: operationResults.success,
                        albums: albumListViewModel
                    });
                });
        };

        /**Always write below line after defining functions you want to use. Else functions will come as undefined */
        async.waterfall([
            execGetAlbums
        ],
            utilities.getUiJsonResponseSender(response)
        );

    },
    
    editAlbum: function (request, response) {
        var album = request.body.album;

        if (!requestValidations.isAddAlbumRequestValid(request.body)) {
            response.json({
                result: operationResults.invalidRequest
            });
            return;
        }

        var checkIfAlbumExists = function (callback) {
            albumModel.find({ id: album.id })
                    
                .exec(function (error, albums) { 
                    if (error) {
                        callback({
                            result: operationResults.problemConnectingToDb
                        });
                        return;
                    }
                    
                    if (albums.length === 0) {
                        callback({
                            result: operationResults.albumOps.albumBeingEditedDoesNotExist
                        });    
                        return;
                    }

                    callback(null, album, albums[0]);
                });
        };

        var executeEditAlbum = function (nAlbum, tracks, dbAlbum, callback) {
            album.tracks = tracks;
            for (var field in album) {
                if (field === 'tracks' || album[field] !== dbAlbum[field]) {//field value has changed
                    dbAlbum[field] = album[field];
                }
            }

            dbAlbum.save(function (error) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, {
                        result: operationResults.success
                    });
                }
            });
            
        };

        async.waterfall([
            checkIfAlbumExists,
            getTrackIds,
            checkTrackIdValidity,
            executeEditAlbum
        ],
            utilities.getUiJsonResponseSender(response)
        );

    },

    addAlbum: function (request, response) {
        var newAlbum = request.body.album;
        
        if (!requestValidations.isAddAlbumRequestValid(request.body)) {
            response.json({
                result: operationResults.invalidRequest
            });
            return;
        }

        var checkIfAlbumExists = function (callback) {
            albumModel.find({ $or: [{id: newAlbum.id}, { name: newAlbum.name }] })
                .lean() //tells Mongoose to skip step of creating full model & directly get a doc
                .select('id name')
                .exec(function (error, albums) { 
                    if (error) {
                        callback({
                            result: operationResults.problemConnectingToDb
                        });
                        return;
                    }

                    if (albums.length > 0) {
                        if (albums[0].id === newAlbum.id) {
                            callback({
                                result: operationResults.albumOps.addAlbumIdAlreadyExists
                            });
                            return;
                        }
                        else if (albums[0].name === newAlbum.name) {
                            callback({
                                result: operationResults.albumOps.addAlbumNameExists
                            });
                            return;
                        }
                    }
                    callback(null, newAlbum, null);
                });
        };
        
        var executeAddAlbum = function (newAlbum, tracks, extras, callback) {
            
            var newAlbumModel = new albumModel({
                id: newAlbum.id,
                name: newAlbum.name,
                thumbnailUrl: newAlbum.thumbnailUrl,
                tracks: tracks,
                description: newAlbum.description
            });
            newAlbumModel.save(function (error) {
                if (error) {
                    callback({
                        result: operationResults.dbOperationFailed
                    }); 
                    return;
                }
                callback(null, {
                    result: operationResults.success
                });
                return;
            });
        };

        /**
         * Task execution flow
         */
        async.waterfall([
            checkIfAlbumExists,
            getTrackIds,
            checkTrackIdValidity,
            executeAddAlbum
        ],
            utilities.getUiJsonResponseSender(response)
        );
    }

};

