(function () {
    'use strict';
    angular.module('config').config(function ($stateProvider, $locationProvider, $urlRouterProvider) {    
        $stateProvider
            .state('manageAlbumsState', {
                url: '/albums',
                templateUrl: 'manageAlbumsPartial',
                abstract: true
            })
            .state('manageAlbumsState.list', {
                url: '',
                templateUrl: 'albumListPartial'
            })
            .state('albumDetailsState', {
                url: '/albums/{id:[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}}',
                templateUrl: 'albumDetailsPartial'
            })
            .state('trackListState', {
                url: '/tracks',
                templateUrl: 'trackListPartial'
            });
        /* If you dont put foll config, you have to attach # to bypass browser
        routing & to let angular to handle routing in non html5 browsers.
        This has to be done so that website works in non html5 browsers. */

        $locationProvider.html5Mode(true);
        //$urlRouterProvider.when('/albums', '/albums/list');
        $urlRouterProvider.otherwise('/albums');
    });
})();
