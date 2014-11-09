angular
    .module('songster.menu')
    .directive('soMenu', ['$menu', SoMenuDirective]);

function SoMenuDirective($menu) {
    return {
        restrict: 'AE',
        scope: {
            menuId: "="
        },
        controller: ['$scope', function SoMenuController($scope) {
            var vm = this;
            vm.menu = $menu.getMenu($scope.menuId);
        }],
        controllerAs: 'vm',
        templateUrl: 'menu/so-menu.tpl.html'
    };
}