angular
    .module('ngBoilerplate')

    .controller('AppCtrl', function AppCtrl($scope, $rootScope, $location, $auth) {

        $rootScope.isAuthorized = function() {
            return $auth.isAuthorized();
        };

        $rootScope.isAnonymous = function() {
            return $auth.isAnonymous();
        };

    });
