angular
    .module('ngBoilerplate.upload')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Upload', 'fa-cloud-upload', 'upload', 500);
    }])

    .config(function config($stateProvider) {
        $stateProvider.state('upload', {
            url: '/upload',
            views: {
                "main": {
                    controller: 'UploadCtrl',
                    templateUrl: 'upload/upload.tpl.html'
                }
            },
            data: {pageTitle: 'Upload files'}
        });
    });