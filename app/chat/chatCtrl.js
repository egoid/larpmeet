'use strict';
angular.module('starry')
.controller('chatCtrl', chatCtrl); 
chatCtrl.$inject = ['$scope', 'firebaseSvc'];
function chatCtrl($scope) {
var chosenMatch = "",
    match = [];

    function changeChat(index) {
        $scope.chatHistory = "",
        fb.child({userid})
            .child('matches')
            .once('value', function(snapshot) {
                match = snapshot.val();
            })
    }
    
    function changeChat(index) {
        chosenMatch = match[index];
        fb.child({userid})
        .child('matches')
        .child({chosenMatch})
        .once("value", function(snapshot) {
            $scope.chatHistory = snapshot.val();
        })
    }
    function sendChat(str) {

    }
};

