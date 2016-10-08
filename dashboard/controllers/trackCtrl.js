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
        
module.exports = {
    registerRoutes: function (app) {
        app.post('/getTracks', this.getTracks);
        app.post('/addTrack', this.addTrack);
        app.post('/editTrack', this.editTrack);
        app.post('/searchTrackByName', this.searchTrackByName);
    },
    
    searchTrackByName: function (request, response) {
        var searchText = request.body.searchText;
    
        var getResultTracks = function (callback) {
            trackModel.find({ $text: { $search: searchText } })
                .lean()
                .select('id name')
                .exec(function (error, tracks) { 
                    if (error) {
                        callback({
                            result: operationResults.dbOperationFailed
                        });
                        return;
                    }
                    callback(null, {
                        result: operationResults.success,
                        tracks: tracks
                    });
                });
        };

        /**Always write below line after defining functions you want to use. Else functions will come as undefined */
        async.waterfall([
            async.constant(request.body.requestBase),
            requestValidations.validateRequestBase,
            getResultTracks
        ],
            utilities.getUiJsonResponseSender(response)
        );        

    },

    getTracks: function (request, response) {
        var reqBody = request.body;

        //TODO: implement pagination!!
        var pageSize = reqBody.pageSize || appConfig.pageSize;
        var pageNumber = reqBody.pageNumber || 1;
        

        var execGetTracks = function (callback) {
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
            async.constant(request.body.requestBase),
            requestValidations.validateRequestBase,
            execGetTracks
        ],
            utilities.getUiJsonResponseSender(response)
        );

    },
    
    editTrack: function (request, response) {
        var track = request.body.track;

        var checkIfTrackExists = function (callback) {
            trackModel.findOne({ id: track.id })
                    
                .exec(function (error, track) { 
                    if (error) {
                        callback({
                            result: operationResults.problemConnectingToDb
                        });
                        return;
                    }
                    /* Edit track is only supposed to check if track being edited exists or not
                    It is not supposed to check whether there are duplicate entries for this track in
                    DB. It is the responsibity of addTrack */
                    if (!track) {
                        callback({
                            result: operationResults.trackOps.trackBeingEditedDoesNotExist
                        });    
                        return;
                    }
                    
                    callback(null, track);
                });
        };

        var checkIfAlbumExists = function (callback) {
            if (!track.albumId) {
                callback(null);
                return;
            }
            albumModel.findOne({ id: track.albumId }, function (error, album) {
                if (error) {
                    callback({
                        result: operationResults.dbOperationFailed
                    });
                    return;
                } 

                if (!album) {
                    callback({
                        result: operationResults.trackOps.albumNotPresentInDb
                    });
                    return;
                }
                
                callback(null);
            });    
        };        
        var executeEditTrack = function (dbTrack, callback) {
            for (var field in track) {
                if (track[field] && (field === 'tracks' || track[field] !== dbTrack[field])) {//field value has changed
                    dbTrack[field] = track[field];
                }
            }

            dbTrack.save(function (error) {
                if (error) {
                    callback({
                        result: operationResults.dbOperationFailed
                    });
                }
                else {
                    callback(null, {
                        result: operationResults.success
                    });
                }
            });
            
        };

        async.waterfall([
            async.constant(request.body.requestBase),
            requestValidations.validateRequestBase,
            checkIfAlbumExists,
            checkIfTrackExists,
            executeEditTrack
        ],
            utilities.getUiJsonResponseSender(response)
        );

    },

    addTrack: function (request, response) {
        var newTrack = request.body.track;
        
        var checkIfTrackExists = function (callback) {
            trackModel.findOne({ $or: [{id: newTrack.id}, { name: newTrack.name }] })
                .lean() //tells Mongoose to skip step of creating full model & directly get a doc
                .select('id name')
                .exec(function (error, track) { 
                    if (error) {
                        callback({
                            result: operationResults.problemConnectingToDb
                        });
                        return;
                    }

                    if (track) {
                        if (track.id === newTrack.id) {
                            callback({
                                result: operationResults.TrackOps.addTrackIdAlreadyExists
                            });
                            return;
                        }
                        else if (track.name === newTrack.name) {
                            callback({
                                result: operationResults.trackOps.addTrackNameAlreadyExists
                            });
                            return;
                        }
                    }
                    callback(null);
                });
        };
        
        var findAssociatedAlbum = function (callback) {
            if (!newTrack.albumId) {
                callback(null);
            }
            else {
                albumModel.findOne({ id: newTrack.albumId })
                    .lean()
                    .select('_id')
                    .exec(function (error, album) {
                        if (error) {
                            callback({
                                result: operationResults.dbOperationFailed
                            });
                            return;
                        } 

                        callback(null, album);
                    });
            }
        };
        var executeAddTrack = function (album, callback) {
            
            var newTrackModel = new trackModel({
                id: newTrack.id,
                name: newTrack.name,
                album: album,
                audioUrl: newTrack.audioUrl
            });
            newTrackModel.save(function (error) {
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
            checkIfTrackExists,
            findAssociatedAlbum,
            executeAddTrack
        ],
            utilities.getUiJsonResponseSender(response)
        );
    }

};

