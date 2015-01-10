angular.module('songster.voting')

    .controller('VoteController', function VoteCtrl($scope, $http, $state, $stateParams, votingService, $event, $player, SongFactory, $account) {
        $scope.event = $event.getEvent();
        $scope.user = $account.getUser();
        $scope.actions = [];

        if($event.isDj()) {
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
                            var song = SongFactory.create(data);
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

            // load user votes for disabling vote button at loading page
            if($scope.event) {
                votingService.loadClientVotesFromServer($scope.event._id);
            }

        }

        $scope.voteUp = function (song) {
            votingService.postVote($scope.event._id, song._id).
                then(function () {
                    votingService.addClientVote(song._id);
                }, function (err) {
                    votingService.removeUserVotesForSong(song._id);
                    $scope.message = err;
                });
        };

        $scope.suggestSong = function (song) {
            votingService.postFileSuggestion($scope.event._id, song._id).
                then(function () {
                    votingService.addClientVote(song._id);
                }, function (err) {
                    votingService.removeUserVotesForSong(song._id);
                })
        };

        // required for voting-library-search-result.tpl.html
        $scope.disableVoteButton = function(song) {
            return votingService.hasClientVotedForSong(song);
        };

        $scope.getVotesForSong = function (song) {
            return votingService.getVotesForSong(song);
        };

        $scope.isSongInQueue = function(song) {
            return votingService.isSongInQueue(song);
        }
    });

