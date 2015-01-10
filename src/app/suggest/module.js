angular
    .module('songster.suggest.services.suggestService', [
        'ui.router'
    ]);

angular
    .module('songster.suggest.services', [
        'songster.suggest.services.suggestService'
    ]);

angular
    .module('songster.suggest', [
        'songster.event',
        'songster.voting.services',
        'songster.suggest.services',
        'ui.router',
        'ui.bootstrap',
        'angular.filter'
    ]);
