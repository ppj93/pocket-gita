(function () { 
    'use strict';

    angular.module('directives').directive('setUploadedFilesOnControllerField', ['$timeout', function ($timeout) {
        return function (scope, element, attrs) {
            var fileChooser = $(attrs['uploadElementSelector'])[0],
                controllerObjectName = attrs['controller'],
                fieldName = attrs['field'];
            
            var watcherFunction = function () {
                return fileChooser.files.length;  
            };          

            fileChooser.onchange = function () {
                scope[controllerObjectName][fieldName] = fileChooser.files;    
                scope.$apply();
            };
        };
    }]);
})();