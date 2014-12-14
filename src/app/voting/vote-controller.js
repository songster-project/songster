angular.module('songster.voting')

    .controller('VoteController', function VoteCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $player) {
        $scope.event = $event.getEvent();
        $scope.actions = [];

        if($rootScope.isDj()) {
            $scope.actions = [{
                'title': 'Add to queue',
                'text': '',
                'icon': 'fa-plus',
                'fn': function(vote) {
                    votingService.getSongFromVote(vote).
                        then(function (data){
                            var song = new window.Song(data);
                            $player.add(song);
                        }, function (err) {
                            $scope.message = err;
                        });
                },
                'class': 'btn btn-xs btn-default'
            }];
        } else {
            $scope.actions = [{
                'title': 'Vote up',
                'text': 'Vote up',
                'icon': 'fa fa-thumbs-o-up',
                'fn':   function voteUp(vote) {
                    votingService.postVote($scope.event._id, vote.song._id).
                        then(function (postingVote) {
                            votingService.set(postingVote);
                            votingService.loadVotes($scope.event._id);
                        }, function (err) {
                            $scope.message = err;
                        });
                },
                'class': 'btn btn-xs btn-primary'
            }];
        }

        $scope.getVotesForSong = function (song) {
            return votingService.getVotesForSong(song);
        };
    });

