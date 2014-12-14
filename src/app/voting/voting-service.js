angular
    .module('songster.voting.services.votingService')
    .provider('votingService', function () {
        this.$get = function ($http, $rootScope, $q) {
            return new VotingService($http, $rootScope, $q);
        };
    });

function VotingService($http, $rootScope, $q) {
    var self = this;
    var _votes = [];
    var _votesMap = {}; // song id to votes count

    this.loadVotes = function (event_id) {
        var url = '/voting/votedsongs';
        if (!!event_id) {
            url += '/' + event_id;
        }
        $http.get(url).success(function(data, status, headers, config){
           var votes = _.map(data, function(vote) {
                return new window.ReceivedVote(vote);
            });
            self.setVotes(votes);
        }).
        error(function( data, status, headers, config){
            // TODO
        });
    };

    this.postVote = function (event_id, song_id) {
        var deferred = $q.defer();
        if (!!event_id || !!song_id) {

            var vote = new window.PostingVote(event_id, song_id);

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

    this.setVotes = function (votes) {
        _votes = votes;
        updateVotesMap();
        $rootScope.$broadcast('VOTES_UPDATED');
    };

    this.getSongFromVote = function (vote) {
        var deferred = $q.defer();
        var url = '/song/' + vote.song._id;
        $http.get(url).success(function(data) {
            deferred.resolve(data);
        }).error(function(err){
           deferred.reject(err);
        });

        return deferred.promise;
    }

    this.addClientVote = function (vote) {
        _clientVotes.push(vote);
    }

    this.setVoteEnable = function () {

    }

    function updateVotesMap() {
        _votesMap = {};
        _.each(_votes, function (vote) {
            _votesMap[vote.song._id] = vote.value;
        });
    }

}
