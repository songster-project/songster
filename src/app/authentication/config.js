angular
    .module('songster.authentication')
    .run(function config($cookies, $auth) {
        if ($cookies.anonymous === 'true') {
            $auth.setAnonymous(true);
        }
    });
