angular
    .module('songster.library.services')
    .provider('$library', LibraryProvider);


function Library($http) {

    this.search = function search(query) {
        var url = '/search/song';
        if (!!query) {
            url += '/' + query;
        }
        return $http.get(url);
    };

    this.updateSongMetadata = function(song) {
        if (song && song._id) {
            return $http.put('/song/' + song._id, song);
        } else {
            return false;
        }
    };

    this.updateCover = function(song) {
        if (song && song._id) {
            return $http.put('/song/' + song._id + '/updateCover', song)
        } else {
            console.log('updateCover() got passed an invalid song');
            return false;
        }
    };
}

function LibraryProvider() {
    this.$get = function ($http) {
        return new Library($http);
    };
}