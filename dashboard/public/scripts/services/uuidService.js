(function () {
    'use strict';

    angular.module('services').factory('uuidService', [function () { 
        return window.uuid;
    }]);
})();