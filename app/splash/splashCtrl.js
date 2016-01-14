'use strict';

angular.module('starry').controller("splashCtrl", splashCtrl);
splashCtrl.$inject = ['$scope', '$http', '$cordovaOauth', '$localStorage', '$state', '$rootScope', 'geoSvc', 'firebaseSvc'];
function splashCtrl ($scope, $http, $cordovaOauth, $localStorage, $state, $rootScope, geoSvc, firebaseSvc) {
    var userINFO = firebaseSvc.returnUI(),
        userKEYS = firebaseSvc.returnUK(),
        geo = geoSvc.returnGeo();
    var lat;
    var lng;
    var debugConsole = $("#console");
// window.cordovaOauth = $cordovaOauth;
// window.http = $http;
    $scope.init = function() {
      window.fbAsyncInit = function() {
          FB.init({
            appId      : 434572043406554,
            cookie     : true, 
            xfbml      : true, 
            version    : 'v2.2' 
          });
            FB.Event.subscribe('edge.create', function(response) {
                window.top.location.href = 'url';
            });
      }
     navigator.geolocation.getCurrentPosition(function (position){
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            debugConsole.text(lat + "  " + lng);           
         }, function (err){
        
         },{timeout: 10000, enableHighAccuracy:false});
    };
    $scope.login = function() {
           FB.login(function(response) {
            localStorage.access_token = (response.authResponse.accessToken);
            statusChangeCallback(response);
            }, {scope: "user_photos,publish_actions"}); 
            // $cordovaOauth.facebook("434572043406554", ["user_photos, publish_actions"]).then(function(result) {
            //     localStorage.access_token = JSON.stringify(result.access_token);
            //     statusChangeCallback(response);
            //     $state.go("profile");
            // }, function(error) {
            //     })
    };
    function statusChangeCallback(response) {
      if (response.status === 'connected') {
          apiDataCall();
        } else if (response.status === 'not_authorized') {

            // $cordovaOauth.facebook("434572043406554", ["user_photos, publish_actions"]).then(function(result) {
            //     localStorage.access_token = JSON.stringify(result.access_token);
            //     statusChangeCallback(response);
            //     $state.go("profile");
            // }, function(error) {
            //     })
        } else {
        }
    };
    function apiDataCall() {
        $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: localStorage.access_token, fields: "id,name,gender, picture", format: "json" }}).then(function(result) {
            var USERID = result.data.id;
            userKEYS.once("value", function(snapshot) {
                if (snapshot.child(USERID).exists() === false) {
                    createNewUser(USERID, result.data.name , result.data.gender)
                } else {
                    var yourKey = snapshot.child(USERID).val();
                    updateGeo(yourKey);
                }
            })
        })
    };
    function updateGeo(key) {
        userINFO.child(key).update({
            lat: lat,
            lng: lng
        }, pullUserData(key));   
    };
    function pullUserData(key) {
        userINFO.child(key).once("value", function(snapshot) {
            $rootScope.yourData = snapshot.val();
            $rootScope.yourKey = key;
            geo.set({
                [key]: [ lat, lng ]
            }).then(function() {
                debugConsole.text("");
                $state.go("profile");
            }, function(error) {
            });    
        })
    };
    function createNewUser(id, name, gender) {
        $http.get("https://graph.facebook.com/v2.5/"+id+"/picture", { params: {access_token: localStorage.access_token , redirect: "false", type: "large"}})
        .then(function(pictureResponse) {
            saveNewUser(id, name, gender, pictureResponse.data.data.url, lat, lng);        
        })
    };
    function saveNewUser(id, name, gender, pic, lat, lng ) {
        var yourData = {
            FBID: id,
            name: name,
            gender: gender,
            pic: pic,
            lat: lat,
            lng: lng,
            likes: [true],
            likedBy: [true],
            matches: [true],
            bio: "Your personal story"
        };
        $rootScope.yourData = yourData; 
        var you = userINFO.push(yourData, function() {
            var yourKey = you.key();
            $rootScope.yourKey = yourKey;
            userKEYS.update({
                [yourData.FBID]: you.key()
            }, function() {
                geo.set({
                    [yourKey]: [ lat, lng ]
                }).then(function() {
                    debugConsole.text("");                
                    $state.go("profile");
                }, function(error) {
                });            
            });
        });
    }
    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}