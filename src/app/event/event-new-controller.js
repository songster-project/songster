angular.module('songster.event')

    .controller('EventNewController', function EventCtrl($scope, $location, $event, $state, EventFactory,$rootScope) {
        $scope.event = $event.getEvent();
        $scope.editEvent = EventFactory.create({
            votingEnabled: true,
            previewEnabled: true,
            suggestionEnabled: true
        });

        $scope.startEvent = function () {
            $event.startBroadcast($scope.editEvent).then(
                function (broadcastEvent) {
                    $rootScope.$broadcast('QUEUE_CHANGED');
                    $state.go('eventDetail', {id: broadcastEvent._id})
                });
        };

        $scope.generatePublicLink = function (event) {
            var url = $location.host() + ':' + $location.port();
            var eventId = event._id;
            return 'http://' + url + '/voting/' + eventId;
        };

    });


