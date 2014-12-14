angular.module('songster.eventhistory')

    .controller('EventHistoryController', function EventCtrl($scope, $eventhistory ) {
        //One question ... when is the getPastEvents() called acutally?
        //Only once ... or more often - just wondering for the case that after i end an event. .. i want it to appear

        //TODO: Initalize this one here with all past events that i had
        $scope.events = $eventhistory.getPastEvents();
        $scope.event={};

        //TODO: here i got to load all the songs that have been played at that event and show them
        $scope.showEvent = function(event) {
            $scope.event = event;
        }
    });