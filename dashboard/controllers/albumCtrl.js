'use strict';
 
var operationResults = require('../../common/constants').operationResults;
var appConfig = require('../config').appConfig;
var mongoUtil = require('../../common/mongoUtil');
var mongoose = require('mongoose');
var albumModel = mongoose.model('album');
var requestValidations = require('./requestValidations');
var uuidGen = require('node-uuid');

var _ = require('underscore');

module.exports = {
    registerRoutes: function (app) {
        app.post('/getAlbums', this.getAlbums);
        app.post('/addAlbum', this.addAlbum);
    },

    getAlbumDetailsPartial: function (req, res) {
        res.render('albumDetailsPartial');
    },
    
    getAlbums: function (req, res) {
        var reqBody = req.body;

        
        if (!requestValidations.isRequestBaseValid(reqBody.requestBase)) {
            res.json({
                result: operationResults.invalidRequest
            });
            return;
        }
        
        var pageSize = reqBody.pageSize || appConfig.pageSize;
        var pageNumber = reqBody.pageNumber || 1;

        mongoUtil.connectToDb(function (error) { 
            res.json({
                result: operationResults.problemConnectingToDb
            });
            return;
        }, function (db) {             
            albumModel.find({}, function (err, albums) {
                /**TODO: check error & return here */
                var albumListViewModel = _.map(albums, function (album) { 
                    return {
                        id: album.id,
                        name: album.name,
                        thumbnailUrl: album.thumbnailUrl
                    };
                });
                res.json({
                    result: operationResults.success,
                    albums: albumListViewModel
                });
            });
        });
    },

    addAlbum: function (req, res) {
        var reqBody = req.body;
        
        if (!requestValidations.isAddAlbumRequestValid(reqBody)) {
            res.json({
                result: operationResults.invalidRequest
            });
            return;
        }
        
        var newAlbum = reqBody.album;
        
        mongoUtil.connectToDb(function (error) { 
            res.json({
                result: operationResults.problemConnectingToDb
            });
            return;
        }, function (db) {  
            albumModel.find({ name: newAlbum.name }, function (err, albums) {
                if (err) {
                    res.json({
                        result: operationResults.dbOperationFailed
                    });
                }
                else if(albums.length > 0) {
                    res.json({
                        result: operationResults.albumOps.albumBeingAddedExists
                    });
                }
                else {
                    var newAlbumModel = new albumModel({
                        id: newAlbum.id,
                        name: newAlbum.name,
                        thumbnailUrl: newAlbum.thumbnailUrl,
                        trackIds: newAlbum.trackIds,
                        description: newAlbum.description,
                        nameInUrl: newAlbum.nameInUrl
                    });
                    newAlbumModel.save(function (error) {
                        if (error) {
                            res.json({
                                result: operationResults.dbOperationFailed
                            }); 
                            return;
                        }

                        res.json({
                            result: operationResults.success
                        });
                        return;
                    });
                }
            });
        });
    }

};

