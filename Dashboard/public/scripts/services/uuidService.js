(function () {
    angular.module('services').factory('uuidService', [function () { 
        return window.uuid;
    }]);
})();