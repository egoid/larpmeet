'use strict';
angular.module('starry').controller('memberMatchCtrl', memberMatchCtrl);
memberMatchCtrl.$inject=['$scope', 'firebaseSvc'];
function memberMatchCtrl ($scope, firebaseSvc) {
  var ref = firebaseSvc.returnFB();
  var userId = localStorage.userId;
  // ref.child(userId).once("value", function(snapshot) {
  //   console.log(snapshot.val());
  // })
  var direction;
  $scope.cards = [
    {test:'one',
    picUrl: 'img/placeholder.png'
    }
  ];
  $scope.cardDestroyed = function(index) {
    console.log('destroy, '+direction);
    $scope.cards.splice(index, 1);
    var newCard = {
      test:'added',
      picUrl: 'img/placeholder.png'
    };
    $scope.cards.push(newCard);
  };
  $scope.swipeLeft = function() {
    console.log('swiped left');
    direction = 'left';
  };
  $scope.swipeRight = function (){
    direction='right';
    console.log('swiped right');
  }
  $scope.transitionLeft = function (){
    console.log('transition left');
    direction = 'left';
  }
  $scope.transitionRight = function (){
    console.log('transition right');
    direction = 'right';
  }
}