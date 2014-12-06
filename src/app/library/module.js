angular.module('songster.library.services', []);

angular.module('songster.library', [
        'songster.library.services',
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'songster.menu',
        'songster.player.services',
        'angular-sortable-view',
        'xeditable'
    ]);