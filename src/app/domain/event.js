'use strict';

angular.module('songster.domain.event')
    .factory('EventFactory', function () {
        window.Event = function Event(data) {
            this._id = data ? data._id : undefined;
            this.name = data ? data.name : undefined;
            this.description = data ? data.description : undefined;
            this.owner_id = data ? data.owner_id : undefined;
            this.start = data ? data.start : undefined;
            this.end = data ? data.end : undefined;
            this.votingEnabled = data ? data.votingEnabled : undefined;
            this.previewEnabled = data ? data.previewEnabled : undefined;
            this.suggestionEnabled = data ? data.suggestionEnabled : undefined;
        };

        return {
            create: function(data) {
                return new window.Event(data);
            }
        };
    });