angular.module('songster.eventHistory')

    .controller('EventHistoryController', function EventCtrl($scope, $eventHistory ) {

        $scope.events = $eventHistory.getPastEvents();
        $scope.showEvent = function(event) {
            $scope.event = event;
            $scope.songs = $eventHistory.getSongsFor(event);
        };
    });