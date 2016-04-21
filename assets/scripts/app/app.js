/**
 * Created by Tim on 4/19/2016.
 */

/*global angular*/

define([
    'angular',
    'angularRoute',
    'angularResource'
], function(){
    return angular.module("photoBlog", ['ngRoute', 'ngResource'])
        .config(function($routeProvider, $locationProvider) {
            $routeProvider.when('/index', {
                templateUrl: '/assets/angular-views/index.html',
                controller: 'Index'
            });
            $routeProvider.otherwise({
                redirectTo: '/index'
            });

            $locationProvider.html5Mode(true);
        })
});
