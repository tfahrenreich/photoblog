/*global angular*/

require.config({
    baseUrl: 'assets/scripts',

    paths: {
        app: 'app',
        angular:'libs/angular/angular.min',
        angularRoute:'libs/angular-route/angular-route.min',
        angularResource:'libs/angular-resource/angular-resource.min'
     },
     shim: {
         'angularRoute' : ['angular'],
         'angularAnimate' : ['angular'],
         'angularResource' : ['angular']
     }
});

require([
    'app/app',
    'angular',
    'app/controllers',
    'app/services'
    //'app/directives',
    //'app/filters'
], function(){
    angular.bootstrap(document, ['photoBlog']);
    console.log('angular:photoBlog init\'d');
});