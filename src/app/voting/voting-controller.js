angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event) {
        $scope.event = $event.getEvent();

        $scope.songs =  [];
        $scope.message = "";

        $scope.voteUp = function voteUp(vote) {
            votingService.postVote($scope.event._id, vote.song._id).
                then(function(){
                    votingService.loadVotes($scope.event._id);
                }, function(err){
                    // implement error handling
                    $scope.message = err;
                });
        };

        $scope.$on('VOTES_UPDATED', function() {
            $scope.songs = votingService.getVotes();
        });

        // load votes for the first time
        votingService.loadVotes($scope.event._id);
    });

