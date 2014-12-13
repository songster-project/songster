angular
    .module('songster.player.services')
    .provider('$player', PlayerProvider);

function Player() {

    // this contains the song elements with metadata - DONT recreate this array we need the references
    var queue = [];


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
        } else {
            console.log('attempted to add invalid or duplicate song-object to playlist');
        }
    };

    this.getQueue = function getQueue() {
        return queue;
    };

    this.clear = function clear() {
        queue.length = 0;
    };

    this.addFirst = function addFirst(song) {
        if (song._id && song.addedDate && song.file_id && !queueContainsSong(song)) {
            queue.unshift(song);
        } else {
            console.log('attempted to add invalid or duplicate song-object to playlist');
        }
    };

    this.pushSongUp = function pushSongUp(index) {
        if (index >= 1 && index < queue.length) {
            queue.swap(index, index - 1);
        }
    };

    this.pushSongDown = function pushSongDown(index) {
        if (index >= 0 && index < queue.length - 1) {
            queue.swap(index, index + 1);
        }
    };

    this.removeSong = function remove(index) {
        if (index >= 0 && index < queue.length) {
            queue.splice(index, 1);
        } else {
            console.log('index to remove larger than queue length');
        }
    };
}

function PlayerProvider() {

    var _player = new Player();

    this.$get = function () {
        return _player;
    };
}
