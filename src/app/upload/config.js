angular
    .module('ngBoilerplate.upload')

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