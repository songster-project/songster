/*
angular
    .module('songster.votingService')
    .factory('votingService', function ($http) {

    var service = {};

    service.loadVotes = function(event_id) {
        var url = '/voting/votedsongs';
        if(!!event_id) {
            url += '/' + event_id;
        }
        return $http.get(url);
    };

    service.postVote = function(event_id, song_id) {
      //  if (!!event_id || !!song_id) {
            $http.get('/account/id').success(function (data){
                var vote =  {
                    owner_id: data.id,
                    event_id: event_id,
                    song_id: song_id,
                    type: 'vote',
                    state: 'new'
                };

                return $http.post('/voting/' + eventid, vote);
            });

     */
/*   } else {
            console.log('postVote() got passed invalid data for vote');
            return false;
        } *//*

    };

    return service;

});
*/

