'use strict';

angular.module('songster.domain.postingVote')
    .config(function() {
        window.PostingVote = function PostingVote(event_id, song_id) {

            this.event_id = event_id ? event_id : undefined;
            this.song_id = song_id ? song_id : undefined;
            this.type = 'vote';
            this.state = 'new';
        };

    });