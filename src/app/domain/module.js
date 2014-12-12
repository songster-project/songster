angular.module('songster.domain.song', []);
angular.module('songster.domain.postingVote', []);
angular.module('songster.domain.receivedVote', []);

angular.module('songster.domain', [
        'songster.domain.song',
        'songster.domain.postingVote',
        'songster.domain.receivedVote'
    ]);