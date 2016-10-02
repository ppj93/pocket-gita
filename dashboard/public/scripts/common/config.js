(function () {
    'use strict';
    
    angular.module('config')
        .constant('serviceUrls', {
            getAlbums: "/getAlbums",
            addAlbum: "/addAlbum",
            deleteAlbum: "/deleteAlbum",
            editAlbum: "/editAlbum",
            getTracks: "/getTracks",
            addTrack: "/addTrack",
            editTrack: "/editTrack",
            deleteTrack: "/deleteTrack"
        })
        .config(['$interpolateProvider', function ($interpolateProvider) { 
            /**
             * Handlebars syntax ie {{}}, conflicts with angular syntax for data binding! -_-
             * So change angular syntax to use some other start & end symbols for databinding
             */
            $interpolateProvider.startSymbol('{[');
            $interpolateProvider.endSymbol(']}');
        }]);
})();