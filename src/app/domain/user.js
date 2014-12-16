'use strict';

angular.module('songster.domain.user')
    .config(function () {
        window.User = function User(data) {
            this._id = data ? data._id : undefined;
            this.username = data ? data.username : undefined;
            this.firstName = data ? data.first_name : undefined;
            this.lastName = data ? data.last_name : undefined;
            this.eMail = data ? data.email : undefined;
            this.anonymous = data ? data.anonymous : false;
        };
    });