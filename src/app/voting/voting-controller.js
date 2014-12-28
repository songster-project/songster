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
        $websocket.register_to_event('votes_changed', function (votes) {
            console.log('in votes changed');
            votingService.setUnwrappedVotes(votes);
            $scope.$apply(function (){
                $scope.votes = votingService.getVotes();
            });
        }, data);

        function initLoadVotes() {
            votingService.loadVotes($scope.event._id);
        }

        initLoadVotes();

    });

