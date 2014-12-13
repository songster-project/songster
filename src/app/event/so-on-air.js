angular
    .module('songster.event')
    .directive('soOnAir', SoOnAirDirective);

function SoOnAirDirective() {
    return {
        restrict: 'AE',
        controller: function ($scope) {
            $scope.isOnAir = false;

            $scope.$on('BROADCAST_STARTED', function () {
                $scope.isOnAir = true;
            });
            $scope.$on('BROADCAST_STOPPED', function () {
                $scope.isOnAir = false;
            });
        },
        templateUrl: 'event/so-on-air.tpl.html'
    };
}
