angular
    .module('songster.event-songs', [
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'songster.menu',
        'songster.event',
        'songster.domain.event',
        'songster.websocket-client'
    ]);