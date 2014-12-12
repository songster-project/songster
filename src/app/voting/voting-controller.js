angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope,$rootScope, $http, $state, $stateParams, votingService) {
        $scope.event_id = $stateParams.eventid;
        $scope.songs =  [];
        $scope.message = "";
        $scope.voteUp = function voteUp(song) {

            votingService.postVote($scope.event_id, song._id._id).
                then(function(){
                    votingService.loadVotes($scope.event_id);
                }, function(err){
                    // implement error handling
                    $scope.message = err;
                });

        };

        $scope.$on('VOTES_UPDATED', function() {
            $scope.songs = votingService.getVotes();
        });


        // load votes for the first time
        votingService.loadVotes($scope.event_id);
    });

