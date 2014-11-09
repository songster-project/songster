angular
    .module('ngBoilerplate.upload', [
        'ui.router',
        'placeholders',
        'ui.bootstrap',
        'angularFileUpload',
        'songster.menu',
        'mediaPlayer'
    ])
    .config(['$menuProvider', function ($menuProvider) {
        $menuProvider.addMenuEntry('main', 'Upload', 'fa-cloud-upload', 'upload');
    }]);