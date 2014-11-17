angular
    .module('songster.menu')

    .config(['$menuProvider', function($menuProvider) {
        $menuProvider.addMenu('main', 'Main Menu');
    }]);