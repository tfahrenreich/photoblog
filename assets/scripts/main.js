/*global angular*/

require.config({
    baseUrl: 'assets/scripts',

    paths: {
        app: 'app',
        jquery:'/assets/scripts/libs/jquery/jquery.min',
        jqueryUI:'/assets/scripts/libs/jquery-ui/jquery-ui',
        angular:'libs/angular/angular.min',
        angularRoute:'libs/angular-route/angular-route.min',
        angularAnimate:'libs/angular-animate/angular-animate.min',
        angularCookies:'libs/angular-cookies/angular-cookies.min',
        angularResource:'libs/angular-resource/angular-resource.min'
     },
     shim: {
         'jqueryUI' : ['jquery'],
         'angularRoute' : ['angular'],
         'angularCookies' : ['angular'],
         'angularResource' : ['angular'],
         'angularAnimate' : ['angular']
     }
});

require([
    'app/app',
    'app/controllers',
    'app/services',
    'app/directives',
    'app/filters'
], function(){
    angular.bootstrap(document, ['photoBlog']);
});