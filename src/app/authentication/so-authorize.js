angular
    .module('songster.authentication')
    .directive('soAuthorize', SoAuthorizeDirective);

function SoAuthorizeDirective() {
    return {
        restrict: 'AE',
        transclude: true,
        replace: true,
        scope: {
            isAuthorized: "=shouldBe",
            showMessage: "="
        },
        templateUrl: 'authentication/so-authorize.tpl.html'
    };
}

