'use strict';

angular.module('songster.domain.postingVote')
    .factory('PostingVoteFactory', function() {
        window.PostingVote = function PostingVote(data) {
            this.event_id = data ? data.event_id : undefined;
            this.song_id = data  ? data.song_id : undefined;
            this.type = 'vote';
            this.state = 'new';
        };

        return {
            create: function(data) {
                return new window.PostingVote(data);
            }
        };
    });