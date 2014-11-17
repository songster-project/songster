angular
    .module('ngBoilerplate.upload')

    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Upload', 'fa-cloud-upload', 'upload', 500);
    }]);