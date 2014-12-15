angular
    .module('ngBoilerplate')

    .controller('AppCtrl', function AppCtrl($scope, $rootScope, $location, $auth, $event) {

        $rootScope.isAnonymous = function() {
            return $auth.isAnonymous();
        };

        $rootScope.isDj = function() {
            return $event.isDj();
        }

    });
