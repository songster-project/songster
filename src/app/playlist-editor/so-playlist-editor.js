/**
 * Created by Thomas on 25.12.2014.
 */
angular
    .module('songster.playlist-editor')

    .controller('PlaylistEditorCtrl', function PlaylistEditorCtrl($scope, $stateParams, $http, UpdateSongFactory, $player, SongFactory) {
        $scope.playlistID = $stateParams.playlistID;

        $scope.addPlaylistToQueue = function () {
            $scope.songs.forEach(function (song) {
                $player.add(song);
            });
        };

        // get playlist metadata
        $http.get('/playlist/' + $scope.playlistID).
            success(function (data) {
                $scope.playlist = data;
            });

        // get song metadata
        $scope.updateSongMetadata = function () {
            $http.get('/playlist/' + $scope.playlistID + '/songs').
                success(function (data) {
                    // <3 manuel's factories
                    $scope.songs = [];

                    if (data) {
                        data.forEach(function (item) {
                            $scope.songs.push(SongFactory.create(item));
                        });
                    }
                });
        };
        $scope.updateSongMetadata();

        $scope.updateSongMetadata = function (song) {
            if (song && song._id) {
                var updateSong = UpdateSongFactory.create(song);
                return $http.put('/song/' + updateSong._id, updateSong);
            } else {
                return false;
            }
        };

        $scope.updateCover = function (song) {
            if (song && song._id) {
                var updateSong = UpdateSongFactory.create(song);
                return $http.put('/song/' + updateSong._id + '/updateCover', updateSong)
            } else {
                return false;
            }
        };

        $scope.actions = [
            {
                'title': 'Add to queue',
                'icon': 'fa-plus',
                'fn': function (song) {
                    $player.add(song);
                }
            },
            {
                'title': 'Delete from Playlist',
                'icon': 'fa-trash-o',
                'fn': function (song, playlist) {

                    if (playlist.songs) {
                        var deleteIdx = -1;
                        playlist.songs.forEach(function (item, idx) {
                            if (item === song._id) {
                                deleteIdx = idx;
                            }
                        });

                        if (deleteIdx != -1) {
                            playlist.songs.splice(deleteIdx, 1);

                            var oldSongs = $scope.songs;
                            $scope.songs = [];
                            oldSongs.forEach(function (oldSong) {
                                if (oldSong._id !== song._id) {
                                    $scope.songs.push(oldSong);
                                }
                            });

                            $http.put('/playlist', playlist);
                        }
                    }
                }
            }
        ];
    });