/**
 * Encapsulate each file in immediately executable blog as follows. Otherwise all objects are
 * created on window object of browser
 */
 
(function () {
    'use strict';

    angular.module('controllers').controller('albumCtrl', ['utilityService', 'constants', 'albumService',
        '$state', 'uuidService', function (utilityService, constants, albumService, $state, uuidService) {
        var that = this;

        this.constants = constants;
            
        this.init = function () { 
            that.getAlbums();
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
                }, function (error) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
                });
            }
            else {
                promise = albumService.editAlbum(album).then(function (response) { 
                    that.message = utilityService.constructMessageObject(constants.messageTypes.success, 'Edited album successfully');
                }, function (error) {
                    that.message = utilityService.constructMessageObject(constants.messageTypes.error, error);
                });
            }

            promise.finally(function () { 
                /** Delete album variable used to store the temporary album object */
                delete that.album;
                $state.go('manageAlbumsState.list');
            });
        };
            
        this.setupAddOrEditAlbum = function (action, album) {
            that.action = action;
            that.fieldsInEditMode = true;
            delete that.message;

            if (that.action === constants.actions.add) {
                that.album = {
                    id: uuidService.v1()
                };    
            }      
            else if (that.action === constants.actions.edit) {
                that.album = album;
            }
            
            $state.go('manageAlbumsState.albumDetails', { id: that.album.id });
        };

        /** Start execution here */
        this.init();
    }]);
})();
