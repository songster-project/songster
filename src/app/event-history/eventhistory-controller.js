angular.module('songster.eventhistory')

    .controller('EventHistoryController', function EventCtrl($scope, $eventhistory ) {
        //One question ... when is the getPastEvents() called acutally?
        //Only once ... or more often - just wondering for the case that after i end an event. .. i want it to appear
        $scope.events = $eventhistory.getPastEvents();

        $scope.showEvent = function(event) {
            $scope.event = event;
            $scope.songs = $eventhistory.getSongsFor(event);
        }
    });