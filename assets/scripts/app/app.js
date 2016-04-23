/**
 * Created by Tim on 4/19/2016.
 */

/*global angular*/

define([
    'angular',
    'angularRoute',
    'angularCookies',
    'angularResource'
], function(){
    return angular.module("photoBlog", ['ngRoute', 'ngResource', 'ngCookies'])
        .config(function($routeProvider, $locationProvider) {
            //TODO: protected routes

            $routeProvider.when('/index', {
                templateUrl: '/assets/angular-views/template-index.html',
                controller: 'IndexCtrl'
            });
            $routeProvider.when('/admin/login', {
                templateUrl: '/assets/angular-views/template-admin-login.html',
                controller: 'AdminLoginCtrl'
            });
            $routeProvider.when('/admin/photos', {
                templateUrl: '/assets/angular-views/template-admin-photos.html',
                controller: 'AdminPhotosCtrl'
            });
            $routeProvider.when('/admin/edit-photo/:id', {
                templateUrl: '/assets/angular-views/template-admin-edit-photo.html',
                controller: 'AddEditPageCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/index'
            });
            $locationProvider.html5Mode(true);
        }
    );
});
