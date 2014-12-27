angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $websocket) {
        $scope.event = $event.getEvent();

        $scope.votes = [];

        $scope.$on('VOTES_UPDATED', function() {
            $scope.votes = votingService.getVotes();
        });

        $scope.refresh = function () {
            votingService.loadVotes($scope.event._id);
        };

        $websocket.register_to_event('votes_changed', function (votes) {
            votingService.setVotes(votes);
        });

        $scope.refresh();
    });

