angular.module('songster.player.services', []);

angular.module('songster.player', [
    'mediaPlayer',
    'songster.player.services',
    'angular-sortable-view',
    'songster.event.services',
    'xeditable',
    'draganddrop'
]);