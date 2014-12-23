angular.module('songster.event')

    .controller('EventDetailController', function EventCtrl($scope, $location, $event, $state) {
        $scope.event = $event.getEvent();

        $scope.endEvent = function () {
            $event.stopBroadcast().then(function () {
                $state.go('event');
            });
        };

        $scope.generatePublicLink = function (event) {
            var url = $location.host() + ':' + $location.port();
            var eventId = event._id;
            return 'http://' + url + '/voting/' + eventId;
        };

        $scope.deleteEvent = function (event) {
            $event.deleteEvent(event).then(function () {
                $state.go('event');
            });

        };


    });


