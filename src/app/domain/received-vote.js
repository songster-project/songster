'use strict';

angular.module('songster.domain.receivedVote')
    .factory('ReceivedVoteFactory', function(SongFactory) {
        window.ReceivedVote = function ReceivedVote(data) {
            this.song = data ? SongFactory.create(data.song_id) : SongFactory.create();
            this.state = data ? data.state : undefined;
            this.type = data ? data.type : undefined;
            this.date = data ? data.date : undefined;
            this.suggestion_type = data ? data.suggestion_type : undefined;
            this.video_id = data ? data.video_id : undefined;
            this.owner_id = data ? data.owner_id : undefined;
            this.event_id = data ? data.event_id : undefined;
        };

        return {
            create: function(data) {
                return new window.ReceivedVote(data);
            }
        };
    });