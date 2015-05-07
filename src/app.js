/* global angular */

angular.module('app', ['ngDrag']).
run(function($rootScope) {

    $rootScope.logit = function(it) {
        console.log(it);
    };

    $rootScope.positions = [];
    while ($rootScope.positions.length < 10) {
        $rootScope.positions.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
        });
    }

    var offsetPosition;
    $rootScope.beginDragPosition = function(position) {
        offsetPosition = angular.copy(position);
    };
    $rootScope.doDragPosition = function(position, $event) {
        position.x = offsetPosition.x + $event.dragX;
        position.y = offsetPosition.y + $event.dragY;
    };

});