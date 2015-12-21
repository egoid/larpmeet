'use strict';
angular.module('starry')
.controller("profileCtrl", profileCtrl); 
profileCtrl.$inject = ['$scope', '$http', '$localStorage', '$state', '$ionicModal', 'firebaseSvc', 'geoSvc'];
function profileCtrl($scope, $http, $localStorage, $state, $ionicModal, firebaseSvc, geoSvc) {
    var ub = firebaseSvc.returnUB();
    var geo = geoSvc.returnGeo();
    var geoQuery;
    var uId;
    var geoUsers = [];
    $scope.init = function() {
        uId = localStorage.USERID;
        console.log(localStorage.USERID);
        ub.child(localStorage.USERID).once("value", function(snapshot) {
            $scope.userData = snapshot.val();
            console.log(snapshot.val());
            var geoQuery = geo.query({
                center: [ snapshot.child('lat').val() , snapshot.child('lng').val() ],
                radius: 20
            });
            console.log(geoQuery);
        var onReadyRegistration = geoQuery.on("ready", function() {
          console.log("GeoQuery has loaded and fired all other events for initial data");
        });

        var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {
          console.log(key + " entered query at " + location + " (" + distance + " km from center)");
        });      
            // geo.set({
            //     [uId] : [snapshot.child('lat').val(), snapshot.child('lng').val()]
            // }).then(function() {
            //     console.log('geo coords added');
            // }, function(error) {
            //     console.log('geo error: ' + error);
            // })
        });
    };
    console.log(geoQuery);
//PROFILE CONTROLLER FUNCTIONS
    $scope.edit = function(elemId) {
        var x =document.getElementById(elemId)
        x.setAttribute('contenteditable', 'true')
    };
    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    $scope.choosePic = function(e) {
        console.log(this)
    }  
    $scope.save = function(name,bio) {
        var updateName = document.getElementById(name).innerText;
        var updateBio = document.getElementById(bio).innerText;
        ub.child(uId).update({full_name: updateName});
        ub.child(uId).update({bio: updateBio});
        $scope.userData.full_name = updateName;
        $scope.userData.bio = updateBio;
    };
    $scope.goMatch = function() {
      $state.go("matches");
    }

};