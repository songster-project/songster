angular
    .module('songster.library.services')
    .service('$library', LibraryService);


function LibraryService($http, $q, SearchResultFactory, UpdateSongFactory, $rootScope, NotificationService) {

    var EVENT_SONG_DELETED = 'SONG_DELETED';

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

    this.deleteSong = function(song) {
        var answer = confirm('Are you sure you want to delete "' + song.title + '" ?');
        if (answer) {
            var deferred = $q.defer();
            $http.delete('/song/' + song._id).success(function (res) {
                song.active = false;
                $rootScope.$broadcast(EVENT_SONG_DELETED, song);
                deferred.resolve();
            }).error(function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    };

    this.updateSongMetadata = function(song) {
        if (song && song._id) {
            var updateSong = UpdateSongFactory.create(song);
            var promise = $http.put('/song/' + updateSong._id, updateSong);
            promise.then(NotificationService.notify); 
            return promise;
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