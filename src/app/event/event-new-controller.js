angular.module('songster.event')

    .controller('EventNewController', function EventCtrl($scope, $location, $event, $state) {
        $scope.event = $event.getEvent();
        $scope.editEvent = new window.Event({
            votingEnabled: true,
            previewEnabled: true,
            suggestionEnabled: true
        });

        $scope.startEvent = function () {
            $event.startBroadcast($scope.editEvent).then(
                function (broadcastEvent) {
                    $state.go('eventDetail', {id: broadcastEvent._id})
                });
        };

        $scope.generatePublicLink = function (event) {
            var url = $location.host() + ':' + $location.port();
            var eventId = event._id;
            return 'http://' + url + '/voting/' + eventId;
        };

    });

