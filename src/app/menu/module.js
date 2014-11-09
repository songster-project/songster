angular
    .module('songster.menu.services', []);

angular
    .module('songster.menu', [
        'templates-app',
        'songster.menu.services'
    ])

    .config(['$menuProvider', function($menuProvider) {
        $menuProvider.addMenu('main', 'Main Menu');
    }]);