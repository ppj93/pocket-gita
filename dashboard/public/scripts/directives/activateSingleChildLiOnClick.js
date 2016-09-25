(function () { 
    'use strict';

    angular.module('directives').directive('activateSingleChildLiOnClick', [ function () {
        return function (scope, element, attrs) {
            var lis = element.find('li');

            var activateClickedInactivateOthers = function (event) {
                

                for (var i = 0; i < lis.length; i++){
                    lis.eq(i).removeClass('active');
                }
                
                $(event.target).parent().addClass('active');
            };

            for (var i = 0; i < lis.length; i++){
                lis.eq(i).click(activateClickedInactivateOthers);
            }            
        };
    }]);
})();