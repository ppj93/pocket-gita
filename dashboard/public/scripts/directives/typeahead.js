(function () { 
    'use strict';

    angular.module('directives').directive('typeahead', [function () {
        return function (scope, element, attrs) {
            var selector = attrs['selector'],
                controller = scope[attrs['controller']],    
                config = controller[attrs['config']];
            
            $(selector).typeahead(config);
        };
    }]);
})();