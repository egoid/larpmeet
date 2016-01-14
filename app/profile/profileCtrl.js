'use strict';
angular.module('starry')
.controller("profileCtrl", profileCtrl); 
profileCtrl.$inject = ['$scope', '$http', '$localStorage', '$state', '$rootScope', '$ionicModal', 'firebaseSvc', 'geoSvc'];
function profileCtrl($scope, $http, $localStorage, $state, $rootScope, $ionicModal, firebaseSvc, geoSvc) {
    var userKEYS = firebaseSvc.returnUK();
    var userINFO = firebaseSvc.returnUI();
    var yourData;
    var yourKey;
    var geo = geoSvc.returnGeo();
    var geoQuery;
    var geoUsers = [];

    $scope.init = function() {
      yourData = $rootScope.yourData;      
      var yourId = $rootScope.yourData.FBID;
      userKEYS.once("value", function(snapshot) {
          yourKey = snapshot.child(yourData.FBID).val();
          $rootScope.yourKey = yourKey;
        $scope.userData = yourData;
        var geoQuery = geo.query({
            center: [ yourData.lat , yourData.lng ],
            radius: 9988888
        });
        var onReadyRegistration = geoQuery.on("ready", function() {
        });
        var onKeyEnteredRegistration = geoQuery.on("key_entered", function(aUserId, location, distance) {
          if (aUserId !== yourKey) {
            addNearby(aUserId, distance)
          }
        });
      });
    };
    function addNearby(userId, distance) {
      userINFO.child(userId).once("value", function(snapshot) {
        var aUser = snapshot.val();
        geoUsers.push(aUser);
      })
    };
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
    }; 
    $scope.save = function(name,bio) {
        var updateName = document.getElementById(name).innerText;
        var updateBio = document.getElementById(bio).innerText;
        userINFO.child($rootScope.yourKey).update({name: updateName, bio: updateBio})
        $scope.userData.name = updateName;
        $scope.userData.bio = updateBio;
    };
    $scope.goMatch = function() {
      $rootScope.geoUsers = geoUsers;
      $state.go("matches");
    };
    $scope.goChat = function() {
      $state.go("chat");
    }
}