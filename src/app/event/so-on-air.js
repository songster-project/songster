angular
    .module('songster.event')
    .directive('soOnAir', SoOnAirDirective);

function SoOnAirDirective() {
    return {
        restrict: 'AE',
        controller: function ($scope, $event, $state) {
            $scope.isOnAir = false;

            $scope.$on('BROADCAST_STARTED', function () {
                $scope.isOnAir = true;
            });
            $scope.$on('BROADCAST_STOPPED', function () {
                $scope.isOnAir = false;
            });
            $scope.redirectToBroadcastEvent = function () {
                var broadcastEvent = $event.getBroadcastEvent();
                $state.go('eventDetail', {
                    id: broadcastEvent._id
                })
            }
        },
        templateUrl: 'event/so-on-air.tpl.html'
    };
}
