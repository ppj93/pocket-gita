'use strict';
 
var operationResults = require('../../common/constants').operationResults,
    appConfig = require('../config').appConfig,
    mongoUtil = require('../../common/mongoUtil'),
    mongoose = require('mongoose'),
    albumModel = mongoose.model('album'),
    requestValidations = require('./requestValidations'),
    uuidGen = require('node-uuid'),
    _ = require('underscore'),
    async = require('async'),
    utilities = require('../../common/utilities'),
    trackModel = mongoose.model('track');

var connectToDb = function (callback) { 
    mongoUtil.connectToDb(function (error, db) {
        if (error) {
            callback({
                result: operationResults.problemConnectingToDb
            });
            return;
        }
        callback(null);
    });
};
        
module.exports = {
    registerRoutes: function (app) {
        app.post('/getAlbums', this.getAlbums);
        app.post('/modifyAlbum', this.modifyAlbum);
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
            connectToDb,
            execGetAlbums
        ],
            utilities.getUiJsonResponseSender(response)
        );

    },
    
    modifyAlbum: function (request, response) {
        var newAlbum = request.body.album;
        
        if (!requestValidations.isAddAlbumRequestValid(request.body)) {
            response.json({
                result: operationResults.invalidRequest
            });
            return;
        }

        var checkIfAlbumExists = function (callback) {
            albumModel.find({ $or: [{ name: newAlbum.name }, { nameInUrl: newAlbum.nameInUrl }] })
                .lean() //tells Mongoose to skip step of creating full model & directly get a doc
                .exec(function (error, albums) { 
                    if (error) {
                        callback({
                            result: operationResults.problemConnectingToDb
                        });
                        return;
                    }

                    if (albums.length > 0) {
                        if (albums[0].name === newAlbum.name) {
                            callback({
                                result: operationResults.albumOps.addAlbumNameExists
                            });
                        }
                        else if (albums[0].nameInUrl === newAlbum.nameInUrl) {
                            callback({
                                result: operationResults.albumOps.addAlbumNameInUrlExists
                            });
                        }
                        return;
                    }

                    callback(null, newAlbum);
                });
        };

        var executeAddAlbum = function (newAlbum, callback) {

            var x = new trackModel({
                id: "12021212",
                name: "af",
                nameInUrl: "adf",
                trackUrl: "asdf"
            });

            x.save(function (error) {
                if (error) {
                    callback({
                        result: {
                            code: "12",
                            message: "track creation failed"
                        }
                    });
                }

               

            var newAlbumModel = new albumModel({
                id: newAlbum.id,
                name: newAlbum.name,
                thumbnailUrl: newAlbum.thumbnailUrl,
                tracks: [x.toObject()._id],
                description: newAlbum.description,
                nameInUrl: newAlbum.nameInUrl
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
                 
            });
        };

        /**
         * Task execution flow
         */
        async.waterfall([
            connectToDb,
            checkIfAlbumExists,
            executeAddAlbum
        ],
            utilities.getUiJsonResponseSender(response)
        );
    }

};

