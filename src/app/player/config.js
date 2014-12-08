angular
    .module('songster.player')

    .run(function SoPlayerRun(editableOptions, editableThemes) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

        // use font awesome and not bs3 glyphicons
        editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary"><i class="fa fa-check"></i></span></button>';
        editableThemes['bs3'].cancelTpl = '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">' +
        '<i class="fa fa-times"></i>' +
        '</button>'
    });