angular
    .module('songster.main-menu')
    .directive('soMainMenu', ['$menu', SoMainMenuDirective]);

function SoMainMenuDirective($menu) {
    return {
        restrict: 'AE',
        scope: {
            menuId: "="
        },
        replace: true,
        controller: ['$scope', function SoMenuController($scope) {
            var vm = this;
            vm.menu = $menu.getMenu($scope.menuId);
        }],
        controllerAs: 'vm',
        templateUrl: 'main-menu/so-main-menu.tpl.html'
    };
}