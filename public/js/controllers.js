'use strict';


// application
function appCtrl ($scope, $location, ndb) {

	$scope.user = {};
	$scope.share_link = $location.absUrl();

	$scope.time_poll = [];
	$scope.location_poll = [];
	$scope.custom_polls = [];

	$scope.date = {};

	$scope.mode = "loading";

	//map objects
	$scope.map = {};
	$scope.markersArray = [];


	$scope.event_data = {};

	function parseEvent(response) {
		$scope.event_data.formatted_datetime = moment(response.datetime).format('MM/DD/YYYY h:mm:ss A');
		$scope.event_data.formatted_date = moment(response.datetime).format('MMMM Do, YYYY');
		$scope.event_data.formatted_time = moment(response.datetime).format('h:mm A');
	}

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
							parseEvent($scope.event_data);

							var userAdded = false;
							for (var i = 0; i < $scope.event_data.people.length; i++) {
								if ($scope.event_data.people[i].id == $scope.user.id) {
									userAdded = true;
									break;
								}
							}
							if (!userAdded) {
								ndb.addUser($scope.user, $location.search()['e']).then(function(user_response) {
									$scope.mode = "view";
								});
							} else {
								$scope.mode = "view";
							}
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
		$scope.date = {
			formatted_datetime: $scope.event_data.formatted_datetime,
			formatted_date: $scope.event_data.formatted_date,
			formatted_time: $scope.event_data.formatted_time,
		}

		$('#date-time-picker').datetimepicker({
			language: 'en',
			pick12HourFormat: true
		}).on('changeDate', function(ev) {
			$scope.$apply(function() {
				$scope.date.submit_datetime = moment(ev.date.valueOf() + 8*60*60*1000).format();
				$scope.date.formatted_date = moment(ev.date.valueOf() + 4*60*60*1000).format('MMMM Do, YYYY');
				$scope.date.formatted_time = moment(ev.date.valueOf() + 4*60*60*1000).format('h:mm A');
			});
		});
		$('#time-modal').modal('show');
	}

	$scope.displayDescriptionModal = function() {

	}

	$scope.displayFacebookModal = function() {

	}

	$scope.displayLocationModal = function() {
		var geocoder = new google.maps.Geocoder();
		var mapOptions = {
			zoom: 10,
			center: new google.maps.LatLng($scope.event_data.loc.lat, $scope.event_data.loc.lon),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		$scope.map = new google.maps.Map(document.getElementById('map-canvas'),
		  mapOptions);
		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng($scope.event_data.loc.lat, $scope.event_data.loc.lon),
		    map: $scope.map,
		    title: $scope.event_data.loc.name
		});
		$scope.markersArray.push(marker);

		$('#location-modal').modal('show');
	}

	$scope.showLocation = function() {
		var geocoder = new google.maps.Geocoder();
		var location = $scope.event_data.loc.name;

		geocoder.geocode( { 'address': location}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
			  for (var i = 0; i < $scope.markersArray.length; i++ ) {
			    $scope.markersArray[i].setMap(null);
			  }
			  $scope.markersArray = [];
			    $scope.map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					position: results[0].geometry.location,
					map: $scope.map,
					title: 'Your Location'
				});
				$scope.markersArray.push(marker);
				console.log('success');
			}else{
			 console.log('fail');
			}
		});

		// add $scope.event_data.loc.name to location poll
	}

	$scope.submitDateChange = function() {
		if ($scope.date.submit_datetime) {
			$scope.event_data.datetime = moment($scope.date.submit_datetime + $scope.date.formatted_time).format();
			parseEvent($scope.event_data);
			ndb.updateEvent($scope.event_data);
		}

		$('#time-modal').modal('hide');
	}

	$scope.removeModal = function() {
		$('#location-modal').modal('hide');
		$('#time-modal').modal('hide');
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