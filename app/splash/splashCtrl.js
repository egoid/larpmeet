'use strict';

angular.module('starry').controller("splashCtrl", splashCtrl);
splashCtrl.$inject = ['$scope', '$http', '$cordovaOauth', '$localStorage', '$state', 'geoSvc', 'firebaseSvc'];
function splashCtrl ($scope, $http, $cordovaOauth, $localStorage, $state, geoSvc, firebaseSvc) {
    var ub = firebaseSvc.returnUB();
    var geo = geoSvc.returnGeo();
    var lat;
    var lng;
    $scope.init = function() {
      window.fbAsyncInit = function() {
          FB.init({
            appId      : 434572043406554,
            cookie     : true,  // enable cookies to allow the server to access 
                                // the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.2' // use version 2.2
          });
            FB.Event.subscribe('edge.create', function(response) {
                window.top.location.href = 'url';
            });
          
      }
        navigator.geolocation.getCurrentPosition(function (position){
            console.log(position);
            lat = position.coords.latitude;
            lng = position.coords.longitude;           
         }, function (err){
           console.log(err);
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
            //     console.log(error);
            //     })
            // };
    }
        // window.cordovaOauth = $cordovaOauth;
        // window.http = $http;
    function statusChangeCallback(response) {
      if (response.status === 'connected') {

          apiDataCall();

        } else if (response.status === 'not_authorized') {
           FB.login(function(response) {
            localStorage.access_token = (response.authResponse.accessToken);
            statusChangeCallback(response);

            }, {scope: "user_photos,publish_actions"});

        } else {
          console.log('fuck u')
        }
        
    };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    function apiDataCall() {

//USE ACCESS TOKEN TO PULL FACEBOOK ID
        $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: localStorage.access_token, fields: "id,name,gender,location", format: "json" }}).then(function(result) {
            console.log(result.data);
            var USERID = result.data.id;
            localStorage.USERID = USERID;
            $state.go("profile")

            console.log(result.data.name);
            console.log(result.data.location);
            ub.once("value", function(snapshot) {
//NO DATA FOR USER? CREATE NEW ONE !    
                if (snapshot.child(USERID).exists() == false) {
                    console.log('USER DOESNT EXIST, CREATING NEW DATA')
                    $http.get("https://graph.facebook.com/v2.5/"+USERID+"/picture", { params: {access_token: localStorage.access_token , redirect: "false", type: "large"}}).then(function(pictureResponse) {
        //GOT THE MAIN PIC !
                        var mainPic = (pictureResponse.data.data.url);
                        console.log(mainPic);
                        FB.api("/me/photos", {type: "uploaded"}, function(photosId) {
                            var pics = [];
                            for (var key in photosId.data) {
                                var thumbnails = [];
                                var url = "/" + photosId.data[key].id ;
        //GETTING ALL PHOTOS & THUMBNAILS !
                                FB.api(url, {fields: "images,picture"}, function (pictureUrls) {
                                    console.log(pictureUrls)
                                    var imgUrl = pictureUrls.images[4].source;
                                    var thumbUrl = pictureUrls.picture;
                                    thumbnails.push(thumbUrl);
                                    pics.push(imgUrl);
                                    if (Number(key) === photosId.data.length - 1) {
                                        // console.log("photo urls --- " + pics)
        //GOT GEO COORDS !              
                                        $state.go("profile")

                                        navigator.geolocation.getCurrentPosition(function (position){
                                            var lat = position.coords.latitude;
                                            var lng = position.coords.longitude;           
                                            newFireBaseUser(USERID, 
                                                            result.data.name, 
                                                            result.data.location.name, 
                                                            result.data.gender,
                                                            "whats your story?",
                                                            pics,
                                                            mainPic,
                                                            lat,
                                                            lng
                                                            )
                                         }, function (err){
                                           console.log(err);
                                         },{timeout: 10000, enableHighAccuracy:false});
                                    }
                                });
                            };
                        });
                    }, function(error) {
                        console.log(error);
                    });
                };
                if (snapshot.child(USERID).exists() == true) {
                    geo.set({
                        [USERID] : [ lat , lng ]
                    }).then(function() {
                        console.log('geo coords added');
                    }, function(error) {
                        console.log('geo error: ' + error);
                    })
                    $state.go("profile")

                }

            });
        }, function(error) {
            console.log(error)
        });
    };
    function newFireBaseUser(uId, name, location, gender, bio, photos, main, lat, lng) {

        ub.set({
            [uId]: {
                [uId]: "userid",
                full_name: name ,
                location: location,
                gender: gender,
                bio: bio,
                photos: photos,
                mainPic: main,
                lat: lat,
                lng: lng
            }
        })

    };
}





                

          

// // CORDOVA OAUTH FOR APPS

