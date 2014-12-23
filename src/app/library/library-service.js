angular
    .module('songster.library.services')
    .provider('$library', LibraryProvider);


function Library($http, $q, SearchResultFactory, UpdateSongFactory) {

    this.search = function search(searchRequest, factory) {
        var deferred = $q.defer();
        var request = searchRequest.generateRequest();
        $http.get(request).success(function (res) {
            var searchResult = SearchResultFactory.create();
            searchResult.fillWithResponse(res, factory);
            deferred.resolve(searchResult);
        }).error(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    this.updateSongMetadata = function(song) {
        if (song && song._id) {
            var updateSong = UpdateSongFactory.create(song);
            return $http.put('/song/' + updateSong._id, updateSong);
        } else {
            return false;
        }
    };

    this.updateCover = function(song) {
        if (song && song._id) {
            var updateSong = UpdateSongFactory.create(song);
            return $http.put('/song/' + updateSong._id + '/updateCover', updateSong)
        } else {
            console.log('updateCover() got passed an invalid song');
            return false;
        }
    };
}

function LibraryProvider() {
    this.$get = function ($http, $q, SearchResultFactory, UpdateSongFactory) {
        return new Library($http, $q, SearchResultFactory, UpdateSongFactory);
    };
}