angular.module('starter.controllers', [])


  //Map Controller
  .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform) {

    $ionicPlatform.ready(function () {

        $ionicLoading.show({
          template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        var posOptions = {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0
        };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;

          var Latlng = new google.maps.LatLng(lat, long);

          var mapOptions = {
            center: Latlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"), mapOptions);


          $scope.map = map;

          var markerOptions = {
            position: Latlng,
            map: map,
            title: "You're here"
          };

          var marker = new google.maps.Marker(markerOptions);

          $ionicLoading.hide();


        }, function (err) {
          $ionicLoading.hide();
          console.log(err);
        });
    })
  })

  //Network controller
  .controller('NetworkCtrl', function ($scope, $cordovaNetwork, $rootScope) {
    document.addEventListener("deviceready", function () {

      $scope.network = $cordovaNetwork.getNetwork();
      $scope.isOnline = $cordovaNetwork.isOnline();
      $scope.$apply();

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $scope.isOnline = true;
        $scope.network = $cordovaNetwork.getNetwork();

        $scope.$apply();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        console.log("got offline");
        $scope.isOnline = false;
        $scope.network = $cordovaNetwork.getNetwork();

        $scope.$apply();
      })

    }, false);
  })

  //Camera controller
  .controller('CameraCtrl', function ($scope, $cordovaCamera) {

    document.addEventListener("deviceready", function () {

      $scope.takePhoto = function () {
        var options = {
          quality: 100,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function (err) {
          // error
        });
      }
    }, false);

  });
