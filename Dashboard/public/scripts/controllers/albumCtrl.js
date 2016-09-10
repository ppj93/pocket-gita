/**
 * Encapsulate each file in immediately executable blog as follows. Otherwise all objects are
 * created on window object of browser
 */
 
(function () {
    'use strict';
    
    angular.module('controllers').controller('albumCtrl', ['utilityService', 'constants', 'albumService',
        '$state', function (utilityService, constants, albumService, $state) {
        var that = this;
        albumService.getAlbums().then(function (albums) { 
            that.albums = albums;
            console.log(that.albums);
        }, function (error) { 
            console.log(error);
        });
        
        this.cancelAddNewAlbum = function () {
            delete that.album;
            $state.go('homeState');
        };

        this.addAlbum = function (album) {
            albumService.addAlbum(album).then(function (response) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.success, "Added successfully");
            }, function (error) { 
                that.message = utilityService.constructMessageObject(constants.messageTypes.error, error.message);
            });  
        };
            
        this.setupAddNewAlbum = function () {
            that.updateAlbumInProgress = true;
            that.album = {};
        };
    }]);
})();
