'use strict';
angular.module('starry').controller('memberMatchCtrl', memberMatchCtrl);
memberMatchCtrl.$inject=['$scope', '$state', '$rootScope', 'firebaseSvc'];
function memberMatchCtrl ($scope, $state, $rootScope, firebaseSvc) {
  var userINFO = firebaseSvc.returnUI();
  var userKEYS = firebaseSvc.returnUK();
  var userCONVO = firebaseSvc.returnCV();

  var yourData;
  var yourKey;
  var yourLikes;
  var yourMatches;
  var direction;
  var counter;

  $scope.init = function() {
    yourKey = $rootScope.yourKey;
    yourData = $rootScope.yourData;
    yourLikes = $rootScope.yourData.likes;
    yourMatches = $rootScope.yourData.matches;
    $scope.cards = $rootScope.geoUsers;
    counter = $scope.cards.length;
  }; 
  function herLikes(her, match) {
    userKEYS.child(her).once("value", function(snapshot){
      var herId = snapshot.val();
      match.unshift(herId);
      yourLikes.push(match);
      userINFO.child(yourKey).child("likes").set(yourLikes);

      addHerNewMatch(herId);

      userINFO.once("value", function(snapshot) {
        for (var key in snapshot.child(herId).child("likes").val()) {
          if (snapshot.child(herId).child("likes").val()[key][0] == yourKey) {
            var newConvo = userCONVO.push([true])
            var newConvoKey = newConvo.key();
            var herMatches = snapshot.child(herId).child("matches").val();
            herMatches.push({convoKey: newConvoKey, 
                             matchKey: yourData.FBID,
                             matchName: yourData.name,
                             matchPic: yourData.pic});
            yourMatches.push({convoKey: newConvoKey,
                              matchKey: herId,
                              matchName: match[2],
                              matchPic: match[1]});
            $rootScope.yourMatches = yourMatches;
            userINFO.child(herId).child("matches").set(herMatches);
            userINFO.child(yourKey).child("matches").set(yourMatches);
          }
        }
      })
    })
  };
  function addHerNewMatch(id) {
    userINFO.once("value", function(snapshot) {
      var herLikes = snapshot.child(id).child("likedBy").val();
      herLikes.push([yourKey, yourData.pic, yourData.name])
      userINFO.child(id).child("likedBy").set(herLikes);
    });
  };
  $scope.cardDestroyed = function(index) {
    counter-= 1;
    if (direction === 'right') {
      var match = [ $scope.cards[index].pic,
                    $scope.cards[index].name ];            
      var herId = $scope.cards[index].FBID;
      herLikes(herId, match);
    };
    $scope.cards.splice(index, 1);
    if (counter > 0) {
      var newCard = {
        name: $scope.cards[index].name,
        bio: $scope.cards[index].bio,
        gender: $scope.cards[index].gender,
        id: $scope.cards[index].FBID
      };
    };
    if (counter === 0) {
      $scope.hideme = true
    };
    $scope.cards.push(newCard);
  };
  $scope.swipeLeft = function() {
    direction = 'left';
  };
  $scope.swipeRight = function (){
    direction='right';
  };
  $scope.transitionLeft = function (){
    direction = 'left';
  };
  $scope.transitionRight = function (){
    direction = 'right';
  };
  $scope.goChat = function() {
    userINFO.child(yourKey).on("value", function(snapshot){
      $rootScope.yourData = snapshot.val();
      $state.go("chat");
    })
  };
  $scope.goProfile = function() {
    userINFO.child(yourKey).on("value", function(snapshot){
      $rootScope.yourData = snapshot.val();
      $state.go("profile");
    })
  }
}