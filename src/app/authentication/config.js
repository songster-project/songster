angular
    .module('songster.authentication')
    .config(function config($httpProvider) {
        $httpProvider.interceptors.push(function ($auth, $cookies) {
            return {
                'response': function (response) {
                    //console.log(response);
                    //console.log(response.headers('isAnonymous'));
                    if (!!$cookies['anonymous']) {
                        $auth.makeAnonymous();
                    }
                    return response;
                }
            };
        });
    })

    .run(function config($cookies, $auth) {
        if (!!$cookies.anonymous) {
            $auth.makeAnonymous();
        }
    });
