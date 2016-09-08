/**
 * Encapsulate each file in immediately executable blog as follows. Otherwise all objects are
 * created on window object of browser
 */
 
angular.module('controllers').controller('albumCtrl', ['albumService', function (albumService) {
    var that = this;
    albumService.getAlbums().then(function (response) { 
        that.albumList = response.albumList;
    }, function (error) { 
        console.log(error);
    });
}]);
