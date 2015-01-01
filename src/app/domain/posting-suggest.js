'use strict';

angular.module('songster.domain.postingSuggest')
    .factory('PostingSuggestFactory', function() {
        window.PostingSuggest = function PostingSuggest(data) {
            this.event_id = data ? data.event_id : undefined;
            this.song_id = data  ? data.song_id : undefined;
            this.type = 'suggestion';
            this.state = 'new';
        };

        return {
            create: function(data) {
                return new window.PostingSuggest(data);
            }
        };
    });