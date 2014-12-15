angular.module('songster.eventHistory')

    .controller('EventHistoryController', function EventCtrl($scope, $eventHistory ) {
        $eventHistory.getPastEvents(function(data){ $scope.events = data;});

        $scope.showEvent = function(event) {
            $scope.event = event;
            $scope.songs = $eventHistory.getSongsFor(event);
        };
    });