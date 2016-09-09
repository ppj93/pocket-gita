(function () { 
    angular.module('directives').directive('actionStatusMessage', ['$watch', 'constants',
        function ($watch, constants) {
        return function (scope, element, attrs) {
            var controllerName = attrs['controller'];
            var messageObjectName = attrs['message'];

            $watch('scope[controllerName][messageObjectName]', function () { 
                var message = scope[controllerName][messageObjectName];
                if (message) {
                    var template;
                    if (message.type === constants.messageTypes.success) {
                        template = '<div class="alert alert-success" role="alert"> %s </div>';                  
                    }
                    else if (message.type === constants.messageTypes.error) {
                        template = '<div class="alert alert-danger" role="alert">...</div>';                  
                    }
                    element.innerHTML = template;
                }
                else {
                    element.innerHTML = '';
                }
                
            });            
        };
    }]);
})();