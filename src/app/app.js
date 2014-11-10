angular
    .module( 'ngBoilerplate')

    .config( function myAppConfig ( $stateProvider, $urlRouterProvider ) {
      $urlRouterProvider.otherwise( '/home' );
    })

    .config(['$menuProvider', function ($menuProvider) {
      $menuProvider.addMenuEntry('main', 'Home', 'fa-home', 'home');
    }])

    .run( function run () {
    })

    .controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
          $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
        }
      });
    });

