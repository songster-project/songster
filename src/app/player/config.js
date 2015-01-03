angular
    .module('songster.player')
    .constant("EVENT_SONG_CONFIG", {
        "MAX_NUMBER_OF_NEXT_SONGS": 5, // number of next songs to send
        "MAX_NUM_PREV_SONGS": 7
    })
    .run(function SoPlayerRun(editableOptions, editableThemes) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        // use font awesome and not bs3 glyphicons
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary"><i class="fa fa-check"></i></span></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">' +
        '<i class="fa fa-times"></i>' +
        '</button>'
    });