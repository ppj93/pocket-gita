(function () { 
    angular.module('directives').directive(['$watch', function ($watch) {
        return function (scope, element, attrs) {
            var controllerName = attrs['controller'];
            var itemsName = attrs['items'];
            var items = scope[controllerName][itemsName];

            $watch('scope[controllerName][itemsName]', function () { 
                console.log("items:");
                var items = scope[controllerName][itemsName];
                console.log(items);
            });            
            
        };
    }]);
})();