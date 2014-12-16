angular.module('songster.account.services', ['ngCookies']);

angular.module('songster.account', [
        'songster.account.services',
        'songster.domain.user'
    ]);