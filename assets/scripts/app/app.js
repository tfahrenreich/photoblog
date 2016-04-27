/**
 * Created by Tim on 4/19/2016.
 */

/*global angular*/

define([
    'angular',
    'angularRoute',
    'angularCookies',
    'angularAnimate',
    'angularResource'
], function(){
    return angular.module("photoBlog", ['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate'])
        .config(function($routeProvider, $locationProvider, $httpProvider) {
            //TODO: protected routes
            $httpProvider.interceptors.push('myHttpInterceptor');

            $routeProvider.when('/', {
                templateUrl: '/assets/angular-views/template-index.html',
                controller: 'IndexCtrl',
                resolve: {
                    collections: function (collectionService) {
                        collectionService.populatedCollection = false;
                        return collectionService.loadCollections();
                    }
                }
            });
            $routeProvider.when('/collections/:id', {
                templateUrl: '/assets/angular-views/template-index.html',
                controller: 'IndexCtrl',
                resolve: {
                    photos: function ($route, photoService) {
                        return photoService.loadPhotos();
                    },
                    collections: function (collectionService) {
                        return collectionService.loadCollections();
                    },
                    loadCollection: function($route, collectionService){
                        return collectionService.loadPopulatedCollection($route.current.params.id)
                    }
                }
            });
            $routeProvider.when('/login', {
                templateUrl: '/assets/angular-views/template-admin-login.html',
                controller: 'AdminLoginCtrl'
            });
            $routeProvider.when('/admin', {
                templateUrl: '/assets/angular-views/template-admin-index.html',
                controller: 'AdminCtrl',
                resolve: {
                    photos: function ($route, photoService) {
                        return photoService.loadPhotos();
                    },
                    collections: function (collectionService) {
                        return collectionService.loadCollections();
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
                    photos: function ($route, photoService) {
                        return photoService.loadPhotos();
                    },
                    collections: function (collectionService) {
                        return collectionService.loadCollections();
                    }
                }
            });
            $routeProvider.when('/admin/collections/:id', {
                templateUrl: '/assets/angular-views/template-admin-collections.html',
                controller: 'AdminCollectionCtrl',
                resolve: {
                    photos: function ($route, photoService) {
                        return photoService.loadPhotos();
                    },
                    collections: function (collectionService) {
                        return collectionService.loadCollections();
                    },
                    loadCollection: function($route, collectionService){
                        return collectionService.loadPopulatedCollection($route.current.params.id)
                    }
                }
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
            $locationProvider.html5Mode(true);
        })
        .run(function($log, $rootScope ,authService, $location, $routeParams){
            $rootScope.$on('$locationChangeStart', function(event) {
                if(String($location.path()).includes('/admin')) authService.check()
            });

            $log.debug('Angular : photoBlog init\'d');
        });
});
