(function () { 
    'use strict';

    angular.module('directives').directive('actionStatusMessage', ['constants',
        function (constants) {
            return {
                link: function (scope, element, attrs) {
                    var controllerName = attrs['controller'];
                    var messageObjectName = attrs['message'];

                    var watcherFunction = function () {
                        if (scope[controllerName][messageObjectName]) {
                            return scope[controllerName][messageObjectName].text + scope[controllerName][messageObjectName].type;    
                        }
                        return "";
                    };

                    scope.$watch(watcherFunction, function (n,o) { 
                        var message = scope[controllerName][messageObjectName];
                        if (message) {
                            var template;
                            if (message.type === constants.messageTypes.success) {
                                template = '<div class="alert alert-success" role="alert"> %s </div>';                  
                            }
                            else if (message.type === constants.messageTypes.error) {
                                template = '<div class="alert alert-danger" role="alert"> %s </div>';                  
                            }
                            element[0].innerHTML = template.replace('%s', message.text);
                        }
                        else {
                            element[0].innerHTML = '';
                        }
                        
                    });            
                }    
            };
        }]);
})();