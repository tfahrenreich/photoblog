/*global angular*/

require.config({
    baseUrl: 'assets/scripts',

    paths: {
        app: 'app',
        $:'/assets/scripts/libs/jquery/jquery.min',
        angular:'libs/angular/angular.min',
        angularRoute:'libs/angular-route/angular-route.min',
        angularCookies:'libs/angular-cookies/angular-cookies.min',
        angularResource:'libs/angular-resource/angular-resource.min'
     },
     shim: {
         'angularRoute' : ['angular'],
         'angularCookies' : ['angular'],
         'angularResource' : ['angular']
     }
});

require([
    '$',
    'app/app',
    'angular',
    'app/controllers',
    'app/services',
    'app/directives'
    //'app/filters'
], function(){
    angular.bootstrap(document, ['photoBlog']);
});