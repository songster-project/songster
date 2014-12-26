/**
 * Created by Thomas on 25.12.2014.
 */
angular
    .module('songster.playlist-menu')
    .directive('playlistMenu', function () {
        return {
            controller: function SoPlaylistMenuController($scope, $http, $rootScope) {
                $scope.showAddDialog = function () {
                    $scope.addClicked = true;
                };

                $scope.addPlaylist = function (playlistName) {
                    $scope.addClicked = false;
                    if (playlistName !== '') {
                        $http.post('/playlist', { name: playlistName }).
                            success(function () {
                                $scope.updatePlaylists();
                            });
                    }
                };

                $scope.cancelAddPlaylist = function () {
                    $scope.addClicked = false;
                    $scope.playlistName = '';
                };

                $scope.updatePlaylists = function () {
                    $http.get('/playlist').
                        success(function (data) {
                            $scope.playlists = data;
                        });
                };

                $scope.deletePlaylist = function (playlistID) {
                    $http.delete('/playlist/' + playlistID).
                        success(function (data) {
                            $scope.updatePlaylists();
                        });
                };

                $scope.onDrop = function (data, playlistID) {
                    var song = data['json/song'];

                    $http.get('/playlist/' + playlistID).
                        success(function (data) {

                            var list = data;
                            if (list.songs) {
                                list.songs.push(song._id);
                            } else {
                                list.songs = [ song._id ];
                            }

                            $http.put('/playlist', list).
                                success(function (data) {
                                    // TODO some UI feedback? if we got time
                                });
                        });
                };

                // Drag over handler.
                $scope.onDragOver = function (event, playlistID) {
                    // TODO some UI feedback? if we got time
                };

                $scope.updatePlaylists();

                // make playlist updates available globally
                $rootScope.updatePlaylists = $scope.updatePlaylists;

            },
            templateUrl: 'playlist-menu/so-playlist-menu.tpl.html'
        };
    });