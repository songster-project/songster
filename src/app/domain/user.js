'use strict';

angular.module('songster.domain.user')
    .factory('UserFactory', function () {
        window.User = function User(data) {
            this._id = data ? data._id : undefined;
            this.username = data ? data.username : undefined;
            this.first_name = data ? data.first_name : undefined;
            this.last_name = data ? data.last_name : undefined;
            this.email = data ? data.email : undefined;
            this.anonymous = data ? data.anonymous : false;
        };

        return {
            create: function(data) {
                return new window.User(data);
            }
        };
    });