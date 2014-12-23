angular
    .module('songster.account.services')
    .provider('$account',AccountProvider);


function AccountService($http, $q, UserFactory) {

    var _user = null;

    this.loadUser = function() {
        var deferred = $q.defer();
        $http.get('/account/info')
            .success(function (data) {
                _user = UserFactory.create(data);
                deferred.resolve();
            })
            .error(function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };

    this.getUser = function() {
            return _user;
    }

}

function AccountProvider() {
    this.$get = function ($http, $q, UserFactory) {
        return new AccountService($http, $q, UserFactory);
    };
}