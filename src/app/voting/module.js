angular
    .module('songster.votingService', [
        'ui.router',
        'placeholders',
        'ui.bootstrap'
    ]);

angular
    .module('songster.voting', [
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'songster.votingService'
    ]);
