'use strict';
 
var operationResults = require('../../common/constants').operationResults,
    appConfig = require('../config').appConfig,
    albumModel = require('../models/album'),
    requestValidations = require('./requestValidations'),
    _ = require('underscore'),
    async = require('async'),
    utilities = require('../../common/utilities'),
    trackModel = require('../models/track');

var getTrackIds = function (params, callback) {
    var newAlbum = params.album;

    if (!newAlbum.tracks || newAlbum.tracks.length === 0) {
        callback(null, newAlbum, [], params);
        return; 
    }

    var trackIds = _.map(newAlbum.tracks, function (track) { return track.id; })
    
    trackModel.find({ id: { $in: trackIds } })
        .lean()
        .select('_id id')
        .exec(function (error, tracks) {
            if (error) {
                callback({
                    result: operationResults.problemConnectingToDb
                });
                return;
            }
            
            params.tracks = tracks;
            callback(null, params);
        });
};
        
var checkTrackIdValidity = function (params, callback) {
    var newAlbum = params.album,
        tracks = params.tracks,
        foundErroneousTrackId = false;
    
    _.each(newAlbum.tracks, function (trackFromAlbum) {
        var trackIdFromAlbum = trackFromAlbum.id;
        if (!_.some(tracks, function (track) { return track.id === trackIdFromAlbum; })) {
            foundErroneousTrackId = true;
            callback({
                result: operationResults.albumOps.trackIdBeingAddedNotFound
            });
        }
    });

    if (!foundErroneousTrackId) {
        callback(null, params);
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

        var executeGetAlbumDetails = function (params, callback) {
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
            async.constant({requestBody: request.body}),
            utilities.checkIfUserIsAuthorized,
            requestValidations.validateGetAlbumDetailsRequest,
            executeGetAlbumDetails
        ],
            utilities.getUiJsonResponseSender(response)
        );
    },

    searchAlbumByName: function (request, response) {
        var searchText = request.body.searchText;
    
        var getResultAlbums = function (extras, callback) {
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
            async.constant({ requestBase: request.body.requestBase}),
            utilities.checkIfUserIsAuthorized,
            utilities.validateRequestBase,
            getResultAlbums
        ],
            utilities.getUiJsonResponseSender(response)
        );        

    },

    getAlbums: function (request, response) {
        var reqBody = request.body;
        
        //TODO: implement pagination!!
        var pageSize = reqBody.pageSize || appConfig.pageSize;
        var pageNumber = reqBody.pageNumber || 1;
        

        var execGetAlbums = function (params, callback) {
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
            async.constant({request: request, requestBase: request.body.requestBase}),
            utilities.checkIfUserIsAuthorized,
            requestValidations.validateRequestBase,
            execGetAlbums
        ],
            utilities.getUiJsonResponseSender(response)
        );

    },
    
    editAlbum: function (request, response) {
        var album = request.body.album;

        var checkIfAlbumExists = function (params, callback) {
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

                    params.dbAlbum = albums[0];                    
                    callback(null, params);
                });
        };

        var executeEditAlbum = function (params, callback) {
            var dbAlbum = params.dbAlbum;
            album.tracks = params.tracks;
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
            async.constant({requestBody: request.body, album: album}),
            utilities.checkIfUserIsAuthorized,
            utilities.validateEditAlbumRequest,
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
        
        var checkIfAlbumExists = function (params, callback) {
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
                    callback(null, params);
                });
        };
        
        var executeAddAlbum = function (params, callback) {
            var tracks = params.tracks;
            
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
            async.constant({requestBody: request.body, album:newAlbum}),            
            utilities.checkIfUserIsAuthorized,
            checkIfAlbumExists,
            getTrackIds,
            checkTrackIdValidity,
            executeAddAlbum
        ],
            utilities.getUiJsonResponseSender(response)
        );
    }

};

