angular.module('songster.voting')

    .controller('VoteController', function VoteCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event) {
        $scope.event = $event.getEvent();

        $scope.voteUp = function voteUp(song) {
            votingService.postVote($scope.event._id, song._id).
                then(function () {
                    votingService.loadVotes($scope.event._id);
                }, function (err) {
                    // implement error handling
                    $scope.message = err;
                });
        };
        $scope.getVotesForSong = function (song) {
            return votingService.getVotesForSong(song);
        };
    });

