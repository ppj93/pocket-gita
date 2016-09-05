angular.module('PocketGita.Config').config(function ($stateProvider) {
    var albumsListState = {
        name: 'home',
        url: '/',
        templateUrl: '/albumsListPartial'
    };

    var tracksListState = {
        name: 'tracksList',
        url: '/tracks',
        templateUrl: '/tracksListPartial'
    };

    var homeState = {
        name: 'home',
        url: '/',
        templateUrl: '/albumsListPartial'
    };

    $stateProvider.state(albumsListState);
    $stateProvider.state(tracksListState);
    $stateProvider.state(homeState);
});