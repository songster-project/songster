'use strict';

angular.module('songster.domain.receivedVote')
    .factory('ReceivedVoteFactory', function(SongFactory) {
        window.ReceivedVote = function ReceivedVote(data) {
            this.song = data ? SongFactory.create(data._id) : SongFactory.create();
            this.value = data ? data.value : undefined;
        };

        return {
            create: function(data) {
                return new window.ReceivedVote(data);
            }
        };
    });