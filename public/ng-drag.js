/* global angular */

(function(angular) {

    angular.module('ngDrag', []).

    directive('ngDragstart', ['$document', '$parse', function($document, $parse) {
        return {
            restrict: 'A',
            link: link,
        };

        function link($scope, $element, $attrs) {
            var dragCtrl = ensureDragCtrl($document, $element, $scope);

            dragCtrl.dragstartHandler = $parse($attrs.ngDragstart);
        }

    }]).

    directive('ngDrag', ['$document', '$parse', function($document, $parse) {
        return {
            restrict: 'A',
            link: link,
        };

        function link($scope, $element, $attrs) {
            var dragCtrl = ensureDragCtrl($document, $element, $scope);

            dragCtrl.dragHandler = $parse($attrs.ngDrag);
        }

    }]).

    directive('ngDragend', ['$document', '$parse', function($document, $parse) {
        return {
            restrict: 'A',
            link: link,
        };

        function link($scope, $element, $attrs) {
            var dragCtrl = ensureDragCtrl($document, $element, $scope);

            dragCtrl.dragendHandler = $parse($attrs.ngDragend);
        }

    }]).

    directive('ngDragcancel', ['$document', '$parse', function($document, $parse) {
        return {
            restrict: 'A',
            link: link,
        };

        function link($scope, $element, $attrs) {
            var dragCtrl = ensureDragCtrl($document, $element, $scope);

            dragCtrl.dragcancelHandler = $parse($attrs.ngDragcancel);
        }

    }]);

    function ensureDragCtrl($document, $element, $scope) {
        var dragCtrl = $element.data('dragCtrl');

        if (!dragCtrl) {
            dragCtrl = new DragCtrl($document, $element, $scope);
            $element.data('dragCtrl', dragCtrl);
        }

        return dragCtrl;
    }

    function DragCtrl($document, $element, $scope) {
        var dragCtrl = this;
        var dragging = false;
        var offsetX, offsetY;

        $element.bind('mousedown', mousedown);

        function mousedown(e) {
            e.preventDefault();

            offsetX = e.pageX;
            offsetY = e.pageY;

            setupDocumentEvents();
        }

        function mousemove(e) {

            e.preventDefault();

            if (!dragging) {
                dragCtrl.dragstartHandler && $scope.$apply(function() {
                    dragCtrl.dragstartHandler($scope, {
                        $event: angular.extend({
                            type: 'dragstart',
                            dragX: e.pageX - offsetX,
                            dragY: e.pageY - offsetY,
                        }, e)
                    });
                });

                dragging = true;
            }

            dragCtrl.dragHandler && $scope.$apply(function() {
                dragCtrl.dragHandler($scope, {
                    $event: angular.extend({
                        type: 'drag',
                        dragX: e.pageX - offsetX,
                        dragY: e.pageY - offsetY,
                    }, e)
                });
            });

        }

        function mouseup(e) {
            dragging = false;
            teardownDocumentEvents();
            dragCtrl.dragendHandler && $scope.$apply(function() {
                dragCtrl.dragendHandler($scope, {
                    $event: angular.extend({
                        type: 'dragend',
                        dragX: e.pageX - offsetX,
                        dragY: e.pageY - offsetY,
                    }, e)
                });
            });
        }

        function mouseout(e) {
            dragging = false;
            teardownDocumentEvents();
            dragCtrl.dragcancelHandler && $scope.$apply(function() {
                dragCtrl.dragcancelHandler($scope, {
                    $event: angular.extend({
                        type: 'dragcancel',
                        dragX: 0,
                        dragY: 0,
                    }, e)
                });
            });
        }


        function setupDocumentEvents() {
            $document.bind('mouseup', mouseup);
            $document.bind('mousemove', mousemove);
            //$document.bind('mouseout', mouseout);
        }

        function teardownDocumentEvents() {
            $document.unbind('mouseup', mouseup);
            $document.unbind('mousemove', mousemove);
            //$document.unbind('mouseout', mouseout);
        }
    }

})(angular);
