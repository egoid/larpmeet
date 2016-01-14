'use strict';
angular.module('starry')
.controller('chatCtrl', chatCtrl); 
chatCtrl.$inject = ['$scope', '$state', '$rootScope', 'firebaseSvc'];
function chatCtrl($scope, $state, $rootScope, firebaseSvc) {
    var userCONVO = firebaseSvc.returnCV();
    var userINFO = firebaseSvc.returnUI();
    var convoKey;
    var matchId;
    var chatHistory;
    var chosenMatchListener;
    var str;
    var yourData;
    var yourMatches;
    $scope.init = function() {
        yourData = $rootScope.yourData;
        yourMatches = $rootScope.yourData.matches;
        yourMatches.shift();
        $scope.matches = yourMatches;
    };
    $scope.changeChat = function(index) {
        $("div.chatbox ul").remove();        
        convoKey = $scope.matches[index].convoKey;
        matchId = $scope.matches[index].matchKey;
        userCONVO.child(convoKey).once("value", function(snapshot) {
            chatHistory = snapshot.val();
            dataListenTo(matchId);
            if (chatHistory.length > 1) {
                $scope.chatHistory = chatHistory;
                chatHistory.shift();
                var chatbox = $(".chatbox");              
            }
        })
    };
    function dataListenTo(id) {
        userCONVO.child(convoKey).on("child_added", function(snapshot) {
            var saveString = snapshot.val();
            if (saveString !== true) {
                var y = $("div.chatbox ul");
                var x = $(".incoming").clone().removeClass().text(saveString);
                if (y.length === 0) {
                    x.appendTo($(".chatbox"));
                    x.addClass("lastOne");
                    chatHistory.push("");
                    $(".inputter").val("");   
                } else {
                    x.appendTo($(".lastOne"));
                    $(".lastOne").removeClass();
                    x.addClass("lastOne");
                    $(".inputter").val("");   
                }
            }
        })
    };
    $scope.sendChat = function() {
        str = $(".inputter").val();
        var saveString = yourData.name + " : " + str;
        chatHistory.push(saveString);
        userCONVO.child(convoKey).set(chatHistory);
    };
    $scope.goProfile = function() {
      $state.go("profile");
    }
}