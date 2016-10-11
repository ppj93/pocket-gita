/**
 * Encapsulate each file in immediately executable blog as follows. Otherwise all objects are
 * created on window object of browser
 */
 
(function () {
    'use strict';

    angular.module('controllers').controller('albumCtrl', ['_', '$scope','trackService', 'utilityService', 'constants', 'albumService',
        '$state', 'uuidService', function (_, $scope, trackService, utilityService, constants, albumService, $state, uuidService) {
        var that = this;

        this.constants = constants;
            
        this.init = function () { 
            that.getAlbums();
        };

        this.searchTrackByName = function (query, aSyncResults) {
            trackService.searchTrackByName(query).then(function (tracks) {
                aSyncResults(tracks);
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });
        };   
 
        this.removeTrackFromAlbum = function (track) {
            var index = _.findIndex(that.album.tracks, function (testTrack) { return track.id === testTrack.id; });
            that.album.tracks.splice(index, 1);
        };
            
        this.addTrackToAlbumIfNotExist = function (track) {
            var index = _.find(that.album.tracks, function (testTrack) { return testTrack.id === track.id; })
            
            if (!index) {
                that.album.tracks.push(track);
            }
        };
            
        this.trackNameTypeaheadConfig = {
            name: 'watever',
            source: that.searchTrackByName,
            displayText: function (track) { return track.name; },
            async: true,
            afterSelect: function (track) {
                that.addTrackToAlbumIfNotExist(track);
                /* Need to do scope.appy because this function is called through jquery */
                $scope.$apply();
            }
        };
    
        this.getAlbums = function () { 
            albumService.getAlbums().then(function (albums) { 
                that.albums = albums;
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });
        };
        
        this.cancelAddOrEditAlbum = function () {
            delete that.album;
            $state.go('manageAlbumsState.list');
        };

        this.submitAddOrEditAlbum = function (album) {
            var promise;
            if (that.action === constants.actions.add) {
                promise =  albumService.addAlbum(album).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, "Added successfully");
                    delete that.album;
                    $state.go('manageAlbumsState.list');
                }, function (error) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
                });
            }
            else {
                promise = albumService.editAlbum(album).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, 'Edited album successfully');
                    delete that.album;
                    $state.go('manageAlbumsState.list');
                }, function (error) {
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error);
                });
            }
        };
            
        this.setupAddOrEditAlbum = function (action, album) {
            that.action = action;
            that.fieldsInEditMode = true;
            delete that.message;

            if (that.action === constants.actions.add) {
                that.album = {
                    id: uuidService.v1(),
                    tracks: []
                }; 
                $state.go('manageAlbumsState.albumDetails', { id: that.album.id });
            }      
            else if (that.action === constants.actions.edit) {
                albumService.getAlbumDetails(album.id).then(function (albumDetails) {
                    that.album = albumDetails;
                    
                    if (!that.album.tracks) {
                        that.album.tracks = [];
                    }

                    $state.go('manageAlbumsState.albumDetails', { id: that.album.id });
                }, function (error) {
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error);
                });
            }

        };

        /** Start execution here */
        this.init();
    }]);
})();
