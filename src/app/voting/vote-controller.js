angular.module('songster.voting')

    .controller('VoteController', function VoteCtrl($scope, $rootScope, $http, $state, $stateParams, votingService, $event, $player) {
        $scope.event = $event.getEvent();
        $scope.actions = [];

        if($rootScope.isDj()) {
            $scope.actions = [{
                'title': 'Add to queue',
                'text': '',
                'disabled': function(song) {
                    return false;
                },
                'icon': 'fa-plus',
                'fn': function(song) {
                    votingService.getSongObjectFromVoteSong(song).
                        then(function (data){
                            var song = new window.Song(data);
                            $player.add(song);
                            // TODO set voting state to in queue or similar
                        }, function (err) {
                            $scope.message = err;
                        });
                },
                'class': 'btn btn-xs btn-default'
            }];
        } else {
            $scope.actions = [{
                'title': 'Vote up',
                'text': 'Vote',
                'disabled': function(song) {
                    return votingService.hasClientVotedForSong(song);
                },
                'icon': 'fa fa-thumbs-o-up',
                'fn':   function(song){
                    $scope.voteUp(song);
                },
                'class': 'btn btn-xs btn-primary'
            }];
        }

        $scope.voteUp = function (song) {
            votingService.postVote($scope.event._id, song._id).
                then(function () {
                    votingService.loadVotes($scope.event._id);
                }, function (err) {
                    $scope.message = err;
                });
        }



        $scope.disableVoteButton =

        $scope.getVotesForSong = function (song) {
            return votingService.getVotesForSong(song);
        };
    });

