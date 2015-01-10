angular
    .module('songster.player.services')
    .provider('$player', PlayerProvider);

function Player($rootScope) {

    // this contains the song elements with metadata - DONT recreate this array we need the references
    var queue = [];

    var QUEUE_CHANGED = 'QUEUE_CHANGED';

    this.queueChanged = function queueChanged(){
        $rootScope.$broadcast(QUEUE_CHANGED);
    };

    function queueContainsSong(obj) {
        var ret = false;
        if (obj._id) {
            queue.forEach(function (element) {
                if (element._id && element._id == obj._id) {
                    ret = true;
                }
            });
        }
        return ret;
    }

    this.add = function add(song) {
        if (song._id && song.addedDate && song.file_id && !queueContainsSong(song)) {
            queue.push(song);
            this.queueChanged();
        } else {
            console.log('attempted to add invalid or duplicate song-object to playlist');
        }
    };

    this.getQueue = function getQueue() {
        return queue;
    };

    this.clear = function clear() {
        queue.length = 0;
        this.queueChanged();
    };

    this.addFirst = function addFirst(song) {
        if (song._id && song.addedDate && song.file_id && !queueContainsSong(song)) {
            queue.unshift(song);
            this.queueChanged();
        } else {
            console.log('attempted to add invalid or duplicate song-object to playlist');
        }
    };

    this.pushSongUp = function pushSongUp(index) {
        if (index >= 1 && index < queue.length) {
            queue.swap(index, index - 1);
            this.queueChanged();
        }
    };

    this.pushSongDown = function pushSongDown(index) {
        if (index >= 0 && index < queue.length - 1) {
            queue.swap(index, index + 1);
            this.queueChanged();
        }
    };

    this.removeSong = function remove(index) {
        if (index >= 0 && index < queue.length) {
            queue.splice(index, 1);
            this.queueChanged();
        } else {
            console.log('index to remove larger than queue length');
        }
    };

    $rootScope.$on('SONG_DELETED', function (evt, deletedSong) {
        var rmIndex = _.findIndex(queue, function (song) {
            return song._id === deletedSong._id;
        });
        if (rmIndex >= 0) {
            queue.splice(rmIndex, 1);
            this.queueChanged();
        }
    });

    window.onbeforeunload = function () {
        if (queue.length > 0) {
            return "You have songs in the queue.";
        }
    };
}

function PlayerProvider() {
    this.$get = function ($rootScope) {
        return new Player($rootScope);
    };
}
