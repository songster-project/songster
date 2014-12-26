/**
 * Created by Thomas on 25.12.2014.
 */
angular
    .module('songster.playlist-editor')

    .config(function config($stateProvider) {
        $stateProvider.state('playlist', {
            url: '/playlist/:playlistID',
            views: {
                "main": {
                    controller: 'PlaylistEditorCtrl',
                    templateUrl: 'playlist-editor/so-playlist-editor.tpl.html'
                }
            },
            data: {pageTitle: 'Playlist Editor'}
        });
    });