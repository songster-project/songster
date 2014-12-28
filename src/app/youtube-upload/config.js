angular
    .module('songster.youtube-upload')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Youtube Upload', 'fa-youtube-play', 'youtube-upload', 400);
    }])

    .config(function config($stateProvider) {
        $stateProvider.state('youtube-upload', {
            url: '/youtube-upload',
            views: {
                "main": {
                    controller: 'YoutubeUploadCtrl',
                    templateUrl: 'youtube-upload/youtube-upload.tpl.html'
                }
            },
            data: {pageTitle: 'Upload Youtube songs'}
        });
    });