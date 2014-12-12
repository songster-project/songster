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

        //ToDo: Manuel => as discussed in the last week of september, you said you are going to continue at this point
        //by going to manage that the availability of the menu ...
        $rootScope.anonymousUser = !!$state.current.data.anonymous;
    });

