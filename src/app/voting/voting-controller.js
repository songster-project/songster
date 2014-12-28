angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $websocket, $suggestService, ReceivedVoteFactory) {
        $scope.event = $event.getEvent();

        $scope.votes = [];

        $scope.$on('VOTES_UPDATED', function() {
            $scope.votes = votingService.getVotes();
        });

        var data = {
            eventid: $scope.event._id
        };
        $websocket.register_to_event('votes_changed', function (vote) {
            var vote = ReceivedVoteFactory.create(vote);
            $rootScope.notifyActivityStream(vote);
            if(vote.state == 'new') {
                votingService.addVote(vote);
                if(vote.type === 'suggestion') {
                    $suggestService.addClientYoutubeSuggestionToAll(vote);
                }
            } else if(vote.state == 'played') {
                votingService.votedSongPlayed(vote.song);
            }
            console.log('voting controller - in votes changed');
            $scope.$apply(function (){
                $scope.votes = votingService.getVotes();
            });
        }, data);

        // init load of votes at loading page or pressing refreshing by F5
        votingService.loadVotes($scope.event._id);

    });

