angular
    .module('songster.library.services')
    .provider('$auth', AuthProvider);


function Auth($http, $q) {

    var _isAnonymous = true;

    this.setAnonymous = function(isAnonymous) {
        _isAnonymous = isAnonymous;
    };

    this.isAnonymous = function() {
        return _isAnonymous;
    }
}

function AuthProvider() {
    this.$get = function ($http, $q) {
        return new Auth($http, $q);
    };
}