angular
    .module('songster.votingService')
    .provider('votingService', function () {
        this.$get = function ($http, $rootScope, $q) {
            return new VotingService($http, $rootScope, $q);
        };
    });

function VotingService($http, $rootScope, $q) {
    var self = this;
    var _votings = [];

    this.loadVotes = function (event_id) {
        var url = '/voting/votedsongs';
        if (!!event_id) {
            url += '/' + event_id;
        }
        $http.get(url).success(function(data, status, headers, config){
            self.setVotings(data);
        }).
        error(function( data, status, headers, config){
            // TODO
        });
    };

    this.postVote = function (event_id, song_id) {
        var deferred = $q.defer();
        // if (!!event_id || !!song_id) {
        $http.get('/account/id').success(function (data) {
            var vote = {
                owner_id: data.id,
                event_id: event_id,
                song_id: song_id,
                type: 'vote',
                state: 'new'
            };
            $http.post('/voting/' + event_id, vote).success(function() {
                deferred.resolve();
            }).error(function(err) {
                deferred.reject(err);
            });
        });


        //  } else {
        //       console.log('postVote() got passed invalid data for vote');
        //     return false;
        //     }

        return deferred.promise;
    };

    this.getVotings = function() {
        return _votings;
    };

    this.setVotings = function(votings) {
        _votings = votings;
        $rootScope.$broadcast('VOTINGS_UPDATED');
    };

}
