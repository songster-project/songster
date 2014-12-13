angular
    .module('songster.library.services')
    .provider('$library', LibraryProvider);


function Library($http, $q) {

    this.search = function search(query, eventId) {
        var deferred = $q.defer();

        var url = '/search/';
        if (eventId !== undefined) {
            url += 'eventsongs/' + eventId + '/';
            if (!!query) {
                url += query;
            } else {
                // we do not query if there is no query for event songs
                deferred.reject();
                return deferred.promise;
            }
        } else {
            url += 'song';
            if (!!query) {
                url += '/' + query;
            }
        }
        $http.get(url).success(function(res) {
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
    this.$get = function ($http, $q) {
        return new Library($http, $q);
    };
}