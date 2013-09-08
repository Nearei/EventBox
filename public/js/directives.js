'use strict';

/* Directives */
angular.module('directives', [])
	.directive('datepicker', function() {
	    return {
	        restrict: 'A',
	        require : 'ngModel',
	        link : function (scope, element, attrs, ngModelCtrl) {
	            $(function(){
					element.datetimepicker({
						language: 'en',
						pick12HourFormat: true
					});
	            });
	        }
	    }
	})