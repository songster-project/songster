'use strict';

angular.module('songster.domain.song')
    .factory('SongFactory', function() {
        window.Song = function Song(data) {
            // super call
            //window.PersistentEntity.call(this, data);

            this.id = data ? data.id : undefined;
            this._id = data ? (data._id ? data._id : data.id) : undefined; // TODO we only have this here, so that the player functions properly. but it should be migrated to 'id'
            this.title = data ? data.title : undefined;
            this.artist = data ? data.artist : undefined;
            this.album = data ? data.album : undefined;
            this.year = data ? data.year : undefined;
            this.cover = data ? data.cover : undefined;
            this.file_id = data ? data.file_id : undefined;
            this.addedDate = data ? data.addedDate : undefined;

            // for the player
            this.src = this.getRawSrc();
            this.type = 'audio/mp3';

            // one-to-many
            //this.milestones = data ? _.map(data.milestones, function (milestone) {
            //    return new window.Milestone(milestone);
            //}) : [];

            // one-to-one
            //this.approvalRho = data ? new window.ProjectApprovable(data.approvalRho) : new window.ProjectApprovable();

        };

        // Inheritence
        //window.Song.prototype = Object.create(window.PersistentEntity.prototype);

        window.Song.prototype.getCoverSrc = function() {
            return this.cover ? ('/song/' + this.cover + '/cover') : 'assets/no_cover.jpg';
        };

        window.Song.prototype.getRawSrc = function() {
            return '/song/' + this.file_id + '/raw';
        };

        return {
            create: function(data) {
                return new window.Song(data);
            }
        };
    });