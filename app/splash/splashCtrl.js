'use strict';

angular.module('starry').controller("splashCtrl", splashCtrl);
splashCtrl.$inject = ['$scope', '$http', '$cordovaOauth', '$localStorage', '$state', '$rootScope', 'geoSvc', 'firebaseSvc'];
function splashCtrl ($scope, $http, $cordovaOauth, $localStorage, $state, $rootScope, geoSvc, firebaseSvc) {
    var userINFO = firebaseSvc.returnUI(),
        userKEYS = firebaseSvc.returnUK(),
        geo = geoSvc.returnGeo();
    var lat;
    var lng;
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
            console.log(lat + "  " + lng);           
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
            //     console.log(error);
            //     })
        } else {
          console.log('Please Login')
        }
    };
    function apiDataCall() {
        $http.get("https://graph.facebook.com/v2.5/me", { params: { access_token: localStorage.access_token, fields: "id,name,gender, picture", format: "json" }}).then(function(result) {
            var USERID = result.data.id;
            console.log("users gender is " + result.data.gender);
            console.log("users name is " + result.data.name);
            userKEYS.once("value", function(snapshot) {
                if (snapshot.child(USERID).exists() === false) {
                    console.log("user doesn't exists, making new one")
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
            console.log("old user, here's your data");
            console.log($rootScope.yourData);
            geo.set({
                [key]: [ lat, lng ]
            }).then(function() {
                console.log('geo coords added');
                $state.go("profile");
            }, function(error) {
                console.log('geo error: ' + error);
            });    
        })
    };
    function createNewUser(id, name, gender) {
        $http.get("https://graph.facebook.com/v2.5/"+id+"/picture", { params: {access_token: localStorage.access_token , redirect: "false", type: "large"}})
        .then(function(pictureResponse) {
            console.log(pictureResponse.data.data.url);
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
            bio: "sup mang"
        };
        $rootScope.yourData = yourData; 
        var you = userINFO.push(yourData, function() {
            var yourKey = you.key();
            $rootScope.yourKey = yourKey;
            console.log($rootScope.yourData);
            userKEYS.update({
                [yourData.FBID]: you.key()
            }, function() {
                geo.set({
                    [yourKey]: [ lat, lng ]
                }).then(function() {
                    console.log('geo coords added');
                    $state.go("profile");
                }, function(error) {
                    console.log('geo error: ' + error);
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

//
    //         if (localStorage.USERKEY) { 

    //             console.log("this user exists, pulling data and redirecting...")
    //             ub.child(localStorage.USERKEY)
    //               .once("value", function(data) {
    //                 for (var key in data.val()) {
    //                     ub.child(localStorage.USERKEY).child(key).once("value", function(snapshot) {
    //                         $rootScope.userData = (snapshot.val());
    //                         console.log($scope.userData);
    //                         $state.go("profile");
    //                     })   
    //                 }
    //             })  
    //         }
    //         if (!localStorage.USERKEY) {
    //                 createNewUser(USERID, result.data.name, result.data.gender );
    //         }
    //     })
    // }   

//    


    // function createNewUser(USERID, name, gender) {
    //     console.log('USER DOESNT EXIST, CREATING NEW DATA...')
    //     $http.get("https://graph.facebook.com/v2.5/"+localStorage.USERID+"/picture", { params: {access_token: localStorage.access_token , redirect: "false", type: "large"}})
    //     .then(function(pictureResponse) {
    //         console.log("main picture url is "+ pictureResponse.data.data.url);
    //         getUserGeo(USERID, name, gender, pictureResponse.data.data.url)

            // $http.get("https://graph.facebook.com/v2.5/"+localStorage.USERID+"/photos", { params: {access_token: localStorage.access_token }})
            // .then(function(pics) {
            //     console.log(pics)
            //     var keys = [];
            //     for (var key in pics.data.data) {
            //         keys.push(pics.data.data[key].id)
            //         if (Number(key) === pics.data.data.length - 1) {
            //             getUserPhotos(USERID, name, gender, pictureResponse.data.data.url, keys);
            //         }
            //     }
            // })
//         })
//     }
//     function getUserPhotos(USERID, name, gender , picture, arr) {
//         console.log('getting all user photo urls...')
//         var picUrls = [];
//         for (var picId in arr) {
//             $http.get("https://graph.facebook.com/v2.5/"+arr[picId], { params: {access_token: localStorage.access_token, fields: "images, picture"}})
//             .then(function(picUrl) {
//                 if (picUrl.data.images[4].source) {
//                     picUrls.push(picUrl.data.images[4].source)
//                         getUserGeo(USERID, name, gender, picture, picUrls)
//                 };
//             })
//         }
//     }
//     function getUserGeo(USERID, name, gender, picture) {
//         console.log('determining user geoCoords...')
//         navigator.geolocation.getCurrentPosition(function (position){
//             var lat = position.coords.latitude;
//             var lng = position.coords.longitude;  
//             console.log("user is located at " + lat + " , " + lng);         
//             newFireBaseUser(USERID,
//                             name, 
//                             gender,
//                             "whats your story?",
//                             picture,
//                             lat,
//                             lng
//                             )
//          }, function (err){
//            console.log(err);
//          },{timeout: 10000, enableHighAccuracy:false});
//     }
//     function newFireBaseUser(uId, name, gender, bio, main, lat, lng) {
//         console.log('saving new user to firebase...')
//         var yourUser = ub.push({
//             [localStorage.USERID]: {
//                 userid: Number(uId),
//                 full_name: name ,
//                 gender: gender,
//                 bio: bio,
//                 mainPic: main,
//                 lat: lat,
//                 lng: lng,
//                 matches: [0]
//             }
//         });
//         $rootScope.userData = {
//                 [uId]: "userid",
//                 full_name: name ,
//                 gender: gender,
//                 bio: bio,
//                 mainPic: main,
//                 lat: lat,
//                 lng: lng,
//         };
//         localStorage.USERKEY = (yourUser.key());
//         $state.go("profile")
//     };
// }
