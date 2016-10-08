/**
 * Encapsulate each file in immediately executable blog as follows. Otherwise all objects are
 * created on window object of browser
 */
 
(function () {
    'use strict';

    angular.module('controllers').controller('trackCtrl', ['utilityService', 'constants', 'albumService',
        'trackService', '$state', 'uuidService', function (utilityService, constants, albumService, trackService, $state, uuidService) {
        var that = this;

        this.constants = constants;
            
        this.init = function () { 
            that.getTracks();
        };

        this.getTracks = function () { 
            trackService.getTracks().then(function (tracks) { 
                that.tracks = tracks;
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });
        };
        
        this.cancelAddOrEditTrack = function () {
            delete that.track;
            $state.go('manageTracksState.list');
        };

        this.submitAddOrEditTrack = function (track) {
            var promise;
            if (that.action === constants.actions.add) {
                promise =  trackService.addTrack(track).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, "Added successfully");
                }, function (error) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
                });
            }
            else {
                promise = trackService.editTrack(track).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, 'Edited track successfully');
                }, function (error) {
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error);
                });
            }

            promise.finally(function () { 
                /** Delete track variable used to store the temporary track object */
                delete that.track;
                $state.go('manageTracksState.list');
            });
        };
            
        this.setupAddOrEditTrack = function (action, track) {
            that.action = action;
            that.fieldsInEditMode = true;
            delete that.message;

            if (that.action === constants.actions.add) {
                that.track = {
                    id: uuidService.v1()
                };    
            }      
            else if (that.action === constants.actions.edit) {
                that.track = track;
            }
            
            $state.go('manageTracksState.trackDetails', { id: that.track.id });
        };

        /** Start execution here */
        this.init();
    }]);
})();
