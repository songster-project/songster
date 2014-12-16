angular
    .module('songster.account')
    .directive('soAccount', SoAccountDirective);

function SoAccountDirective() {
    return {
        restrict: 'AE',
        replace: true,
        controller: ['$scope', '$account', '$q', function ($scope, $account, $q) {

            $scope.username = "";

            $account.loadUser().then(function () {
                $scope.username = $account.getUser().username;
            });

        }],
        templateUrl: 'account/so-account.tpl.html'
    };
}