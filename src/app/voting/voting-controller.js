angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event) {
        $scope.event = $event.getEvent();

        $scope.votes = [];

        $scope.$on('VOTES_UPDATED', function() {
            $scope.votes = votingService.getVotes();
            console.log($scope.votes);
        });

        $scope.refresh = function () {
            votingService.loadVotes($scope.event._id);
        };

        $scope.refresh();
    });

