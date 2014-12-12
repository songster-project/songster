'use strict';

angular.module('songster.domain.receivedVote')
    .config(function() {
        window.ReceivedVote = function ReceivedVote(data) {
            this.song = data ? new window.Song(data._id) : new window.Song();
            this.value = data ? data.value : undefined;
        };

    });