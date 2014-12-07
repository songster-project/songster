angular
    .module('songster.player.services')
    .provider('$player', PlayerProvider);


function Player() {

    // this contains the song elements with metadata - DONT recreate this array we need the references
    var queue = [];

    this.add = function add(song) {
        if (song._id && song.addedDate && song.file_id && !queue.containsSong(song)) {
            song['src'] = '/song/' + song.file_id + '/raw';
            song['type'] = 'audio/mp3';
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
        if (song._id && song.addedDate && song.file_id && !queue.containsSong(song)) {
            song['src'] = '/song/' + song.file_id + '/raw';
            song['type'] = 'audio/mp3';
            queue.unshift(song);
        } else {
            console.log('attempted to add invalid or duplicate song-object to playlist');
        }
    };

    this.pushSongUp = function pushSongUp(index) {
        if (index >= 0 && index >= 1 && index < queue.length) {
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

    Array.prototype.swap = function (x, y) {
        var b = this[x];
        this[x] = this[y];
        this[y] = b;
        return this;
    };

    Array.prototype.containsSong = function (song) {
        var ret = false;
        if (song._id) {
            this.forEach(function (element) {
                if (element._id && element._id == song._id) {
                    ret = true;
                }
            });
        }
        return ret;
    };
}

function PlayerProvider() {

    var _player = new Player();

    this.$get = function () {
        return _player;
    };
}