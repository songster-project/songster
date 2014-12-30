angular.module('songster.voting')

    .controller('VotingCtrl', function VotingCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $websocket) {
        $scope.event = $event.getEvent();

        $scope.votes = [];

        $scope.$on('VOTES_UPDATED', function() {
            $scope.votes = votingService.getVotes();
        });

        var data = {
            eventid: $scope.event._id
        };
        $websocket.register_to_event('votes_changed', function (vote) {
            votingService.processWebsocketVote(vote);
            $scope.$apply(function (){
                $scope.votes = votingService.getVotes();
            });
        }, data);

        // init load of votes at loading page or pressing refreshing by F5
        votingService.loadVotes($scope.event._id);

    });

