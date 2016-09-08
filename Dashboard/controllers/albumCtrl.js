var operationResults = require('../common/constants').operationResults;
var appConfig = require('../config').appConfig;
var mongoUtil = require('../common/mongoUtil');
var mongoose = require('mongoose');
var albumModel = mongoose.model('album');
var requestValidations = require('./requestValidations');

var _ = require('underscore');

module.exports = {
    registerRoutes: function (app) {
        app.get('/albumListPartial', this.getAlbumListPartial);
        app.post('/getAlbumList', this.getAlbumList);
        app.post('addAlbum', this.addAlbum);
    },

    getAlbumListPartial: function (req, res) {
        res.render('albumListPartial');
    },

    getAlbumList: function (req, res) {
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
        }, function (db) {             
            albumModel.find({}, function (err, albums) {
                var albumListViewModel = _.map(albums, function (album) { 
                    return {
                        id: album.id,
                        name: album.name,
                        thumbnailUrl: album.thumbnailUrl
                    };
                });
                res.json({
                    result: operationResults.success,
                    albumList: albumListViewModel
                });
            });
        });
    },

    addAlbum: function (req, res) {
        var reqBody = req.body;
        
        if (!requestValidations.isAddAlbumRequestValid(req)) {
            res.json({
                result: operationResults.invalidRequest
            });
        }
        
        var pageSize = reqBody.pageSize || appConfig.pageSize;
        var pageNumber = reqBody.pageNumber || 1;

        mongoUtil.connectToDb(function (error) { 
            res.json({
                result: operationResults.problemConnectingToDb
            });
        }, function (db) {             
            albumModel.find({}, function (err, albums) {
                var albumListViewModel = _.map(albums, function (album) { 
                    return {
                        id: album.id,
                        name: album.name,
                        thumbnailUrl: album.thumbnailUrl
                    };
                });
                res.json({
                    result: operationResults.success,
                    albumList: albumListViewModel
                });
            });
        });
    }

};

