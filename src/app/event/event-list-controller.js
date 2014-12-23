angular.module('songster.event')

    .controller('EventListController', function EventCtrl($scope, $event, $state) {
        $scope.events = [];
        $scope.broadcastEvent = $event.getBroadcastEvent();

        $event.getEvents().then(function (events) {
            $scope.events = events;
        });

        $scope.redirectToEvent = function (event) {
            $state.go('eventDetail', {
                id: event._id
            });
        };

        $scope.deleteEvent = function (event) {
            console.log("Deleting event: "+event._id);
        }

    });


