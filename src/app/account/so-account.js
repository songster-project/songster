angular
    .module('songster.account')
    .directive('soAccount', SoAccountDirective);

function SoAccountDirective() {
    return {
        restrict: 'AE',
        scope: {
            username : "="
        },
        replace: true,
        /*
        controller: ['$scope', function SoMenuController($scope) {
            var vm = this;
            vm.menu = $menu.getMenu($scope.menuId);
        }],
        controllerAs: 'vm' */
        templateUrl: 'account/so-account.tpl.html'
    };
}