'use strict';
 
var operationResults = require('../../common/constants').operationResults,
    appConfig = require('../config').appConfig,
    mongoUtil = require('../../common/mongoUtil'),
    mongoose = require('mongoose'),
    albumModel = require('../models/album'),
    requestValidations = require('./requestValidations'),
    uuidGen = require('node-uuid'),
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
    },
    
    searchAlbumByName: function (request, response) {
        var searchText = request.body.searchText;
        

        var results = [];

        var insertAlbumInResultsIfNotPresent = function (album) {
            if (!_.some(results, function (resultAlbum) {
                return resultAlbum.id === album.id;
            })) {
                results.push(album);
            }
        };
        
        var getResultAlbums = function (term, callback) {
            albumModel.find({ $text: term })
                .lean()
                .select('id name')
                .exec(function (error, albums) { 
                    if (error) {
                        callback({
                            result: operationResults.problemConnectingToDb
                        });
                        return;
                    }
                    callback(null, albums);
                });
        };
        
        _.each(searchText.split(' '), function (text) {
            albumModel.find({ $text: text })
                .lean()
                .select('id name')
                .exec(function (error, albums) {
                    _.each(albums, function (album) { insertAlbumInResultsIfNotPresent(album); });
                });
        });

        /**Always write below line after defining functions you want to use. Else functions will come as undefined */
        async.waterfall([
            execGetAlbums
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
                                result: operationResults.albumOps.idAlreadyExists
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

