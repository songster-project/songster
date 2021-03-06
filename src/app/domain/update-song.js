'use strict';

angular.module('songster.domain.updateSong')
    .factory('UpdateSongFactory', function () {
        window.UpdateSong = function UpdateSong(data) {
            this._id = data ? data._id : undefined;
            this.title = data ? data.title : undefined;
            this.artist = data ? data.artist : undefined;
            this.album = data ? data.album : undefined;
            this.year = data ? data.year : undefined;
        };

        return {
            create: function(data) {
                return new window.UpdateSong(data);
            }
        };
    });