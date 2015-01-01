angular
    .module('songster.voting.services.votingService')
    .provider('votingService', function () {
        this.$get = function ($http, $rootScope, $q, SongFactory, ReceivedVoteFactory, PostingVoteFactory) {
            return new VotingService($http, $rootScope, $q, SongFactory, ReceivedVoteFactory, PostingVoteFactory);
        };
    });

function VotingService($http, $rootScope, $q, SongFactory, ReceivedVoteFactory, PostingVoteFactory) {
    var self = this;
    var _votes = [];
    var _votesMap = {}; // song id to votes count
    var _clientVotes = {}; // votes of current client

    this.loadVotes = function (event_id) {
        console.log('load votes from server');
        var url = '/voting/votedsongs';
        if (!!event_id) {
            url += '/' + event_id;
        }
        $http.get(url).success(function(data, status, headers, config){
            var votes = _.map(data, function(vote) {
                return ReceivedVoteFactory.create(vote);
            });
            self.setVotes(votes);
        }).
            error(function( data, status, headers, config){
                // TODO
            });
    };

    this.postVote = function (event_id, song_id) {
        console.log('in post vote');
        var deferred = $q.defer();
        if (!!event_id && !!song_id) {

            var vote = PostingVoteFactory.create({event_id: event_id, song_id: song_id});

            $http.post('/voting/' + event_id, vote).success(function() {
                deferred.resolve();
            }).error(function(err) {
                deferred.reject(err);
            });

        } else {
            console.log('postVote() got passed invalid data for vote');
            return false;
        }

        return deferred.promise;
    };

    this.getVotesForSong = function (song) {
        return _votesMap[song._id];
    };

    this.getVotes = function() {
        return _votes;
    };

    this.setUnwrappedVotes = function (data) {
        var votes = _.map(data, function(vote) {
            return ReceivedVoteFactory.create(vote);
        });
        self.setVotes(votes);
    }

    this.processWebsocketVote = function (vote) {
        var vote = ReceivedVoteFactory.create(vote);
        if(vote.state == 'new') {
            self.addVote(vote);
        } else if(vote.state == 'played') {
           self.votedSongPlayed(vote.song);
        }
    }

    this.setVotes = function (votes) {
        _votes = votes;
        updateVotesMap();
        $rootScope.$broadcast('VOTES_UPDATED');
    };

    this.addVote = function(vote) {
        _votes.push(vote);
        updateVotesMap();
        $rootScope.$broadcast('VOTES_UPDATED');
    }

    this.getSongObjectFromVoteSong = function (song) {
        var deferred = $q.defer();
        var url = '/song/' + song._id;
        $http.get(url).success(function(data) {
            deferred.resolve(data);
        }).error(function(err){
            deferred.reject(err);
        });

        return deferred.promise;
    };

    this.loadClientVotesFromServer = function (event_id) {
        $http.get('/voting/uservotes/' + event_id).success(function(data, status, headers, config) {
            _clientVotes = {};
            _.each(data, function(song) {
                var song = new SongFactory.create(song.song_id);
                _clientVotes[song._id] = true;
            });
        }).error(function() {
            console.log('getting uservotes error');
        });
    }

    this.addClientVote = function(songId) {
        _clientVotes[songId] = true;
    }

    function removeUserVotesForSong(songId){
        delete _clientVotes[songId];
    };

    this.hasClientVotedForSong = function(song) {
        return _clientVotes[song._id] !== undefined ? true : false;
    };

    function updateVotesMap() {
        _votesMap = {};
        _.each(_votes, function (vote) {
            var old = _votesMap[vote.song._id];
            _votesMap[vote.song._id] = old ? old + 1 : 1;
        });
    }

    this.votedSongPlayed = function(song) {
        if(song) {
           var new_votes = _.filter(_votes, function (vote) {
                return vote.song._id !== song._id;
            });
            self.setVotes(new_votes)

            if(!$rootScope.isDj()) {
                removeUserVotesForSong(song._id);

            }
        }
    }


}
