'use strict';
angular.module('starry')
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider  
        .state('splash', {
            url: '/splash',
            templateUrl: 'app/splash/splash.html',
            controller: 'splashCtrl'
        })    
        .state('profile', {
            url: '/profile',
            templateUrl: 'app/profile/profile.html',
            controller: 'profileCtrl'
        })
        .state('matches', {
            url: '/matches',
            templateUrl: 'app/matches/matches.html',
            controller: 'memberMatchCtrl'
        })
        .state('chat', {
          url: '/chat',
          templateUrl: 'app/chat/chat.html',
         controller: 'chatCtrl'
        });
    $urlRouterProvider.otherwise('/splash');
});

