angular
    .module('ngBoilerplate')

    .controller('AppCtrl', function AppCtrl($scope, $rootScope, $location, $auth, $event, $account) {

        $rootScope.isAnonymous = function() {
            return $auth.isAnonymous();
        };

        $rootScope.isDj = function() {
            return $account.getUser() && $event.getEvent() && $event.getEvent().owner_id ==  $account.getUser()._id;
        }

    });
