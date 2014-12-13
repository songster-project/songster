angular
    .module('songster.authentication')
    .run(function config($cookies, $auth) {
        if (!!$cookies.anonymous) {
            $auth.setAnonymous($cookies.anonymous);
        }
    });
