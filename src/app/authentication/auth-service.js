angular
    .module('songster.library.services')
    .provider('$auth', AuthProvider);


function Auth() {

    var _isAnonymous = false;

    this.isAnonymous = function() {
        return _isAnonymous;
    };

    this.setAnonymous = function (isAnonymous) {
        _isAnonymous = isAnonymous;
    };
}

function AuthProvider() {
    this.$get = function () {
        return new Auth();
    };
}