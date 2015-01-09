angular.module('songster.eventTv')

    .controller('EventTvController', function EventCtrl($scope, $event) {
        $scope.event = $event.getEvent();
    });


