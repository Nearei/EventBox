'use strict';

// Declare app level module which depends on filters, and services
var sp = angular.module('EventBox', ['services', 'directives']);

//dashboard ng-view
angular.module('content', []).
	config(function ($routeProvider, $locationProvider) {
        $routeProvider.otherwise({
            controller: mainCtrl,
        });
	})