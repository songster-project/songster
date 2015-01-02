'use strict';

angular.module('songster.domain.postingSuggest')
    .factory('PostingSuggestFactory', function() {
        window.PostingSuggest = function PostingSuggest(data) {
            this.event_id = data ? data.event_id : undefined;
            this.song_id = data  ? data.song_id : undefined;
            this.type = 'suggestion';
            this.state = 'new';
            this.suggestion_type = data ? data.suggestion_type : undefined;
            this.video_id = data ? data.video_id : undefined;
        };

        return {
            create: function(data) {
                return new window.PostingSuggest(data);
            }
        };
    });