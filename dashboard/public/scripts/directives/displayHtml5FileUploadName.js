(function () { 
    'use strict';

    angular.module('directives').directive('displayHtml5FileUploadName', [function () {
        return function (scope, element, attrs) {
            var fileChooser = $(attrs['uploadElementSelector'])[0];

            var watcherFunction = function () {
                return (fileChooser.files && fileChooser.files[0]) ? fileChooser.files[0].name : '';  
            };          

            scope.$watch(watcherFunction, function (newValue, oldValue) {
                element[0].innerHTML = newValue;
            });
        };
    }]);
})();