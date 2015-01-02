angular
    .module('songster.voting.services.votingService', [
        'ui.router'
    ]);

angular
    .module('songster.voting.services', [
        'songster.voting.services.votingService'
    ]);

angular
    .module('songster.voting', [
        'songster.voting.services',
        'ui.router',
        'ui.bootstrap',
        'angular.filter',
        'songster.suggest'
    ]);
