(function () {
    'use strict';
    angular.module('config').config(function ($stateProvider, $locationProvider, $urlRouterProvider) {    
        $stateProvider
            .state('login', {
                url: '/google',
                templateUrl: 'google'
            })
            .state('manageAlbumsState', {
                url: '/albums',
                templateUrl: 'manageAlbumsPartial',
                abstract: true
            })
            .state('manageAlbumsState.list', {
                url: '',
                templateUrl: 'albumListPartial'
            })
            .state('manageAlbumsState.albumDetails', {
                /**
                 * foll reg-exp is for a GUID - each album has a uuid
                 */
                url: '/{id:[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}}',
                templateUrl: 'albumDetailsPartial'
            })
            .state('manageTracksState', {
                url: '/tracks',
                templateUrl: 'manageTracksPartial',
                abstract:true
            })
            .state('manageTracksState.list', {
                url: '',
                templateUrl: 'trackListPartial'
            })
            .state('manageTracksState.trackDetails', {
                /**
                 * foll reg-exp is for a GUID - each album has a uuid
                 */
                url: '/{id:[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}}',
                templateUrl: 'trackDetailsPartial'
            });
        
        /* If you dont put foll config, you have to attach # to bypass browser
        routing & to let angular to handle routing in non html5 browsers.
        This has to be done so that website works in non html5 browsers. */

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/albums');
    });
})();
