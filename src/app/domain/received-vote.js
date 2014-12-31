'use strict';

angular.module('songster.domain.receivedVote')
    .factory('ReceivedVoteFactory', function(SongFactory) {
        window.ReceivedVote = function ReceivedVote(data) {
            console.log(data);
            this.song = data ? SongFactory.create(data.song_id) : SongFactory.create();
            //this.value = data ? data.value : undefined;
            this.state = data ? data.state : undefined;
            this.type = data ? data.type : undefined;
            this.date = data ? data.type : undefined;
        };

        return {
            create: function(data) {
                return new window.ReceivedVote(data);
            }
        };
    });