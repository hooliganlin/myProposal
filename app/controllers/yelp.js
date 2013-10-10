var myApp = angular.module('myApp', ['YelpModel', 'hmTouchevents']);

myApp.controller('TitleBarCtrl', function ($scope) {
  steroids.view.navigationBar.hide();
  $scope.goBack = function() {
    steroids.layers.pop();
  };

 
  $scope.isHome = true;
});

// Index: http://localhost/views/pew/index.html
myApp.controller('IndexCtrl', function ($scope) {

  $scope.showCategory = function(category) {
    pushListView();
  };

  $scope.keyUp = function(event) {
    if(event.keyCode === 13) {
      pushListView();
    }
  };

  function pushListView() {
    var webView = new steroids.views.WebView('/views/yelp/list.html');
    webView.preload();

    steroids.layers.push({
      'view': webView,
      'navigationBar': false
    });
  }

});

myApp.controller('ListCtrl', function ($scope, PewRestangular) {

  // Show the details of the selected place
  $scope.showDetails = function(id) {
    var webView = new steroids.views.WebView('/views/yelp/details.html?id='+ id);
    webView.preload();
    steroids.layers.push({
      'view' : webView,
      'navigationBar': false 
    });
  };

  // Fetch all objects from the local JSON (see app/models/pew.js)
  $scope.places = PewRestangular.all('places').getList();

  /**
   * Maps a rating number to a class number for the ratings
   */ 
  $scope.getRating = function(rating) {
    switch (rating) {
      case 0 : return "none";
      case .5 : return "half";
      case 1: return "one";
      case 1.5: return "onehalf";
      case 2: return "two";
      case 2.5: return "twohalf";
      case 3: return "three";
      case 3.5: return "threehalf";
      case 4: return "four";
      case 4.5: return "fourhalf";
      case 5: return "five";
      default: return "none";
    }
  };

  /**
   * Converts the price value into a dollar string.
   */
  $scope.getPrice = function(price) {
    var dollarSigns = '';
    for (var i = 0; i < parseInt(price); i++) {
      dollarSigns += '$';
    }
    return dollarSigns;
  };

});


myApp.controller('DetailsCtrl', function ($scope, $filter, PewRestangular) {
    // Fetch all objects from the places json and filter the matched place id
    PewRestangular.all('places').getList().then(function (places) {
      $scope.place = $filter('filter')(places, { place_id: steroids.view.params['id']})[0];
    });

    // Fetch all reviews from the local JSON (see app/models/yelp.js)
    $scope.reviews = PewRestangular.all('reviews').getList();

    // Fetch all photos from the JSON.
    $scope.photos = PewRestangular.all('photos').getList();

    $scope.getRating = function(rating) {
        switch (rating) {
          case 0 : return "none";
          case .5 : return "half";
          case 1: return "one";
          case 1.5: return "onehalf";
          case 2: return "two";
          case 2.5: return "twohalf";
          case 3: return "three";
          case 3.5: return "threehalf";
          case 4: return "four";
          case 4.5: return "fourhalf";
          case 5: return "five";
          default: return "none";
      }
    };

    /**
     * Converts the price value into a dollar string.
     */
    $scope.getPrice = function(price) {
      var dollarSigns = '';
      for (var i = 0; i < parseInt(price); i++) {
        dollarSigns += '$';
      }
      return dollarSigns;
    };

    $scope.showPictures = function() {
      var modalPictureView = new steroids.views.WebView('/views/yelp/picture-viewer.html');
      steroids.modal.show(modalPictureView);
    };

});

myApp.controller('PictureViewerCtrl', function ($scope, $filter, PewRestangular) {
  
  PewRestangular.all('photos').getList().then(function (photos) {
    $scope.photos = $filter('filter')(photos, { isThumbnail: false});
  });


  $scope.currIndex = 0;
  $scope.nextPicture = function() {
    if ($scope.currIndex < $scope.photos.length - 1) {
      $scope.currIndex++;
    }
  };

  $scope.prevPicture = function() {
    if ($scope.currIndex > 0) {
      $scope.currIndex--;
    }
  }


});

