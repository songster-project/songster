angular
    .module('songster.config')

    .constant('CONFIG', {
        resultsPerPage: 10,
        pagination: {
            maxShownPages: 5
        }
    });