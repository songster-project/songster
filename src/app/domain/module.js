angular.module('songster.domain.song', []);
angular.module('songster.domain.postingVote', []);
angular.module('songster.domain.receivedVote', []);
angular.module('songster.domain.searchResult', []);
angular.module('songster.domain.updateSong', []);
angular.module('songster.domain.event', []);
angular.module('songster.domain.user', []);

angular.module('songster.domain', [
        'songster.domain.song',
        'songster.domain.postingVote',
        'songster.domain.receivedVote',
        'songster.domain.searchResult',
        'songster.domain.updateSong',
        'songster.domain.event',
        'songster.domain.user'
    ]);