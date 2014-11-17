angular
    .module('ngBoilerplate')

    .controller('AppCtrl', function AppCtrl($scope, $location) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate';
            }
        });
    });

