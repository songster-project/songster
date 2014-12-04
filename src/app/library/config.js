angular
    .module('songster.library')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Library', 'fa-music', 'library', 3);
    }])

    .config(function config($stateProvider) {
        $stateProvider.state('library', {
            url: '/library',
            views: {
                "main": {
                    controller: 'LibraryController',
                    templateUrl: 'library/library.tpl.html'
                }
            },
            data: {pageTitle: 'Library'}
        });
    });