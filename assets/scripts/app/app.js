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
                controller: 'IndexCtrl',
                resolve: {
                    photos: function ($route, photoService) {
                        return photoService.loadPhotos();
                    }
                }
            });
            $routeProvider.when('/admin/login', {
                templateUrl: '/assets/angular-views/template-admin-login.html',
                controller: 'AdminLoginCtrl'
            });
            $routeProvider.when('/admin', {
                templateUrl: '/assets/angular-views/template-admin-index.html',
                controller: 'AdminCtrl',
                resolve: {
                    photos: function ($route, photoService) {
                        return photoService.loadPhotos();
                    }
                }
            });
            $routeProvider.when('/admin/edit-photo/:id', {
                templateUrl: '/assets/angular-views/template-admin-photo.html',
                controller: 'AdminPhotoCtrl',
                resolve: {
                    collections: function (collectionService) {
                        return collectionService.loadCollections();
                    },
                    photo: function ($route, photoService) {
                        return photoService.loadPhotos([$route.current.params.id]);
                    }
                }
            });
            $routeProvider.when('/admin/collections', {
                templateUrl: '/assets/angular-views/template-admin-collections.html',
                controller: 'AdminCollectionCtrl',
                resolve: {
                    collections: function (collectionService) {
                        return collectionService.loadCollections();
                    }
                }
            });
            $routeProvider.otherwise({
                redirectTo: '/index'
            });
            $locationProvider.html5Mode(true);
        }
        ).run(function($log){
            $log.debug('Angular : photoBlog init\'d');
            //TODO check for authentication on admin routes
        });
});
