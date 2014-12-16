angular
    .module('songster.account.services')
    .provider('$account',AccountProvider);


function Account($http, $q) {

    var _user = null;

    this.loadUser = function() {
        var deferred = $q.defer();
        $http.get('/account/info')
            .success(function (data) {
                _user= new window.User(data);
                deferred.resolve();
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }



    this.getUser = function() {
            return _user;
    }

}

function AccountProvider() {
    this.$get = function ($http, $q) {
        return new Account($http, $q);
    };
}