angular.module('starter.controllers', [])


  //Map Controller
  .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $ionicPopup) {

    $ionicPlatform.ready(function () {

      $scope.mapInitLoad = function () {
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner><br/>Getting location!'
        });

        var posOptions = {
          enableHighAccuracy: true,
          timeout: 20000,
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

          var markerOptions = {
            position: Latlng,
            map: map,
            title: "You're here"
          };

          $scope.marker = new google.maps.Marker(markerOptions);

          $scope.map = map;

          $scope.infowindow = new google.maps.InfoWindow({
            content: 'Latitude: ' + lat +
            '<br>Longitude: ' + long
          });

          $scope.infowindow.open($scope.map, $scope.marker);

          $ionicLoading.hide();


        }, function (err) {
          $ionicLoading.hide();

          $scope.errPopup = function () {
            $ionicPopup.alert({
              title: 'Error occured!',
              content: 'Please check your geolocation settings and pull the page down to refresh.'
            }).then(function (res) {
              console.log('Error');
            });
          };

          $scope.errPopup();

          console.log(err);
        });
      };


      $scope.mapRefresher = function () {
        $scope.mapInitLoad();
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.mapInitLoad();

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

    $scope.isTrue = false;

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
