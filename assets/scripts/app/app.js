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
            $routeProvider.when('/view1', {
                templateUrl: '/assets/angular-views/test.html',
                controller: 'MyCtrl1'
            });
            $routeProvider.otherwise({
                redirectTo: '/view1'
            });

            $locationProvider.html5Mode(true);
        })
});
