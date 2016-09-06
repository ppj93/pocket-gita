angular.module('PocketGita.Config').config(function ($stateProvider, $locationProvider) {    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'albumListPartial'
        })
        .state('albums', {
            url: '/albums',
            templateUrl: 'albumListPartial'
        })
        .state('tracks', {
            url: '/tracks',
            templateUrl: 'trackListPartial'
        });

    $locationProvider.html5Mode(true);
});