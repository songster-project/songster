angular
    .module('songster.account.services')
    .provider('$account', AccountProvider);


function Account() {

    var _isAnonymous = false;

    this.isAnonymous = function() {
        return _isAnonymous;
    };

    this.setAnonymous = function (isAnonymous) {
        _isAnonymous = isAnonymous;
    };
}

function AccountProvider() {
    this.$get = function () {
        return new Account();
    };
}