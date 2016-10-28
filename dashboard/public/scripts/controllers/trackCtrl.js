/**
 * Encapsulate each file in immediately executable blog as follows. Otherwise all objects are
 * created on window object of browser
 */
 
(function () {
    'use strict';

    angular.module('controllers').controller('trackCtrl', ['$timeout', '$scope', 'utilityService', 'constants', 'albumService',
        'trackService', '$state', 'uuidService', function ($timeout, $scope, utilityService, constants, albumService, trackService, $state, uuidService) {
        var that = this;

        this.constants = constants;
            
        this.init = function () { 
            that.getTracks();
        };

        this.getTracks = function () { 
            trackService.getTracks(true).then(function (tracks) { 
                that.tracks = tracks;
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });
        };
        
        this.cancelAddOrEditTrack = function () {
            delete that.track;
            $state.go('manageTracksState.list');
        };


        this.searchAlbumByName = function (query, aSyncResults) {
            albumService.searchAlbumByName(query).then(function (albums) {
                aSyncResults(albums);
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });
        };   
            
        this.removeUploadedMp3 = function () {
            delete that.track.mp3Files;  
        };
            
        this.submitAddOrEditTrack = function (track) {
            var promise;
            if (that.action === constants.actions.add) {
                promise =  trackService.addTrack(track).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, "Added successfully");
                    delete that.track;
                    $state.go('manageTracksState.list');

                }, function (error) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
                });
            }
            else {
                promise = trackService.editTrack(track).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, 'Edited track successfully');
                    delete that.track;
                    $state.go('manageTracksState.list');

                }, function (error) {
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
                });
            }
        };
            
        this.albumNameTypeaheadConfig = {
            name: 'albumNameTypeahead',
            source: that.searchAlbumByName,
            displayText: function (album) { return album.name; },
            async: true
        };

        this.searchAudioUrl = function (query, aSyncResults) {
            trackService.searchAudioUrl(query).then(function (s3Tracks) { 
                aSyncResults(s3Tracks);
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });    
        };
            
        this.audioUrlTypeaheadConfig = {
            name: 'audioUrlTypeahead',
            source: that.searchAudioUrl,
            displayText: function (track) { return track.name; },
            async: true
        };

        this.setupAddOrEditTrack = function (action, track) {
            that.action = action;
            that.fieldsInEditMode = true;
            delete that.message;

            if (that.action === constants.actions.add) {
                that.track = {
                    id: uuidService.v1()
                }; 
                $state.go('manageTracksState.trackDetails', { id: that.track.id });c
            }      
            else if (that.action === constants.actions.edit) {
                trackService.getTrackDetails(track.id).then(function (track) { 
                    that.track = track;
                    if (!that.track.album) {
                        that.track.album = {};
                    }
                    $state.go('manageTracksState.trackDetails', { id: that.track.id });
                },
                function (error) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
                });
            }
        };

        this.clickMp3ChooserButton = function () {
            $("#track-mp3-chooser").click();            
        };
            
        /** Start execution here */
        this.init();
    }]);
})();
