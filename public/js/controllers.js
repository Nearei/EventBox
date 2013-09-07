'use strict';


// application
function appCtrl ($scope, $location, ndb) {

	$scope.user = {};

	$scope.time_poll = [];
	$scope.location_poll = [];
	$scope.custom_polls = [];

	$scope.mode = "loading";


	$scope.event_data = {};

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

					if ($location.search()['e']) {
						ndb.getEvent($location.search()['e']).then(function(response) {
							$scope.event_data = response;
						});
					} else {

						$scope.event_data = {
							name: 'Insert Event Name Here',
							host_name: $scope.user.name,
							host_fb_id: $scope.user.id,
							description: "Insert Description Here",
							datetime: moment().format(),
							loc: {
								lat: 43.451603,
								lon: -80.492277,
								name: 'Google Waterloo'
							},
							picture_url: '/img/event4.jpg',
							people: [$scope.user],
						};

						ndb.addEvent($scope.event_data).then(function(response) {
							$location.search("e", response);

							$scope.mode="view";
						});
					}
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
				window.location.assign("/");
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

	$scope.addPollOption = function(poll_type, option) {
		poll_type.push({
			option : option,
			votes : [$scope.user],
		});
	}

	$scope.vote = function(poll_type, option) {
		for (var i = 0; i < poll_type.length; i++) {
			if (poll_type[i] == option && poll_type[i].votes.indexOf($scope.user) == -1) {
				poll_type[i].votes.push($scope.user);
			}
		}
	}



};