angular.module('songster.eventhistory')

    .controller('EventHistoryController', function EventCtrl($scope, $http ) {
        $scope.events = [{name: "1"},{ name: "2"}];
        $scope.event={};
        
        $scope.showEvent = function(event) {
            $scope.event = event;
        }
    });