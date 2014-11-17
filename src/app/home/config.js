angular.module('ngBoilerplate.home')

    .config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
      $urlRouterProvider.otherwise( '/home' );
    })

    .config(['$menuProvider', function ($menuProvider) {
      $menuProvider.addMenuEntry('main', 'Home', 'fa-home', 'home', 1000);
    }]);