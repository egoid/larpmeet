'use strict';

angular.module('starry').service('geoSvc', geoSvc);
geoSvc.$inject = ['firebaseSvc']
function geoSvc(firebaseSvc) {
  var gb = firebaseSvc.returnGB();
  

  var geoFire = new GeoFire(gb);

  this.returnGeo = function() {
    return geoFire;
  }
}