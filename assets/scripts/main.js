/**
 * Created by Tim on 4/19/2016.
 */

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
    'app/controllers'
    //'app/services',
    //'app/directives',
    //'app/filters'
], function($){
    //console.log($);
});

console.log('sup fam');