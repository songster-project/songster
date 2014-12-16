angular
    .module('songster.library.services')
    .provider('$library', LibraryProvider);


function Library($http, $q) {

    this.search = function search(query, eventId) {
        var deferred = $q.defer();

        var url = '/search/';
        var body = {};
        if (eventId !== undefined) {
            url += 'eventsongs/' + eventId;
            body.query = query;
            if (!query) {
                // we do not query if there is no query for event songs
                deferred.reject();
                return deferred.promise;
            }
        } else {
            url += 'song';
            if (!!query) {
                body.query = query;
            }
        }
        $http.post(url, body).success(function (res) {
            var searchResult = new window.SearchResult();
            searchResult.fillWithResponse(res, window.Song);
            deferred.resolve(searchResult);
        }).error(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.updateSongMetadata = function(song) {
        if (song && song._id) {
            var updateSong = new window.UpdateSong(song);
            return $http.put('/song/' + updateSong._id, updateSong);
        } else {
            return false;
        }
    };

    this.updateCover = function(song) {
        if (song && song._id) {
            var updateSong = new window.UpdateSong(song);
            return $http.put('/song/' + updateSong._id + '/updateCover', updateSong)
        } else {
            console.log('updateCover() got passed an invalid song');
            return false;
        }
    };
}

function LibraryProvider() {
    this.$get = function ($http, $q) {
        return new Library($http, $q);
    };
}