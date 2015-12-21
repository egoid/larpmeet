'use strict';

angular.module('starry').service('firebaseSvc', firebaseSvc);

function firebaseSvc() {
  var fb = new Firebase('https://larpameet.firebaseio.com/');
  var gb = new Firebase('https://larpameet.firebaseio.com/geo/');
  var ub = new Firebase('https://larpameet.firebaseio.com/users/');
  

  this.returnFB = function() {
    return fb;
  }
  this.returnGB = function() {
    return gb;
  }
  this.returnUB = function() {
    return ub;
  }
}