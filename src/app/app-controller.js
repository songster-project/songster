angular
    .module('ngBoilerplate')

    .controller('AppCtrl', function AppCtrl($scope, $rootScope, $location, $auth) {

        $rootScope.isAnonymous = function() {
            return $auth.isAnonymous();
        };

    });
