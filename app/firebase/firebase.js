'use strict';

angular.module('starry').service('firebaseSvc', firebaseSvc);

function firebaseSvc() {
  var fb = new Firebase('https://larpameet.firebaseio.com/');
  var gb = new Firebase('https://larpameet.firebaseio.com/geo/');
  var ui = new Firebase('https://larpameet.firebaseio.com/userinfo/');
  var uk = new Firebase('https://larpameet.firebaseio.com/userkeys/');
  var cv = new Firebase('https://larpameet.firebaseio.com/convo/');
  
  this.returnFB = function() {
    return fb;
  };
  this.returnGB = function() {
    return gb;
  };
  this.returnUI = function() {
    return ui;
  };  
  this.returnUK = function() {
    return uk;
  };  
  this.returnCV = function() {
    return cv;
  }
}