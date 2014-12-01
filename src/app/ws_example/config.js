angular
    .module('songster.ws_example')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Ws_Example', 'fa-bell', 'ws_example', 498);
    }]);