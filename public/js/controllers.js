'use strict';


// application
function appCtrl ($scope, $location) {

	$scope.user = {};

	window.fbAsyncInit = function() {
		FB.init({
			appId      : '654824984529366', // App ID
			channelUrl : '//localhost:8080/kevin.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});

		FB.getLoginStatus(function(response) {
			if (response.authResponse) {
				FB.api('/me', function(response) {
					$scope.user = response;


					console.log($scope.user);
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
			}

		});
	};


	// Load the SDK asynchronously
	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = "//connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));

	$scope.event_data = {name: 'Insert Event Name Here',
						 time: '11:30:00',
						 date: 'September 13, 2013',
						 loc: {
						 	lat: 43.451603,
						 	lon: -80.492277,
						 	name: 'Google Waterloo'
						 },
						 picture: '/img/event1.jpg'}
 


	$scope.displayPictureModal = function() {

	}

	$scope.displayInfoModal = function() {

	}

	$scope.displayTimeModal = function() {

	}

	$scope.displayDescriptionModal = function() {

	}

	$scope.displayFacebookModal = function() {

	}

	$scope.removeModal = function() {

	}

};