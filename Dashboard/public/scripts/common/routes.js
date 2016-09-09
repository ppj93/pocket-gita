angular.module('config').config(function ($stateProvider, $locationProvider) {    
    $stateProvider
        .state('homeState', {
            url: '/',
            templateUrl: 'manageAlbumsPartial'
        })
        .state('albumViewState', {
            url: '/albums',
            templateUrl: 'manageAlbumsPartial'
        })
        .state('trackViewState', {
            url: '/tracks',
            templateUrl: 'trackListPartial'
        });
    /* If you dont put foll config, you have to attach # to bypass browser
    routing & to let angular to handle routing in non html5 browsers.
    This has to be done so that website works in non html5 browsers. */

    $locationProvider.html5Mode(true);
});