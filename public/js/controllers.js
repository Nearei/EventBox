'use strict';


// application
function appCtrl ($scope, $location, ndb) {

	$scope.user = {};
	$scope.share_link = "";

	$scope.time_poll = [];
	$scope.location_poll = [];
	$scope.custom_polls = [];

	$scope.date = {};
	$scope.title = "";
	$scope.description = "";
	$scope.img_url = "";
	$scope.location = "";

	$scope.popular = {
		datetime: "",
		location: "",
	};

	$scope.mode = "loading";

	//map objects
	$scope.map = {};
	$scope.markersArray = [];


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
					$scope.user.img_url = "http://graph.facebook.com/" + $scope.user.id + "/picture?width=120&height=120";
					console.log($scope.user);

					if ($location.search()['e']) {
						ndb.getEvent($location.search()['e']).then(function(response) {
							$scope.event_data = response;
							parsePopular();

							var userAdded = false;
							for (var i = 0; i < $scope.event_data.people.length; i++) {
								if ($scope.event_data.people[i].id == $scope.user.id) {
									userAdded = true;
									break;
								}
							}
							if (!userAdded) {
								ndb.addUser($scope.user, $location.search()['e']).then(function(user_response) {
									$scope.event_data.people.push($scope.user);
									$scope.mode = "view";
									$scope.share_link = $location.absUrl();
								});
							} else {
								$scope.mode = "view";
								$scope.share_link = $location.absUrl();
							}
						});
					} else {

						$scope.event_data = {
							name: 'Insert Event Name Here',
							host_name: $scope.user.name,
							host_fb_id: $scope.user.id,
							description: "Insert Description Here",
							picture_url: '/img/event_default_picture.jpg',
							people: [$scope.user],
							polls: [
								{name: 'datetime',
								 selections: []},
								{name: 'location',
								 selections: []}
							]
						};

						ndb.addEvent($scope.event_data).then(function(response) {
							$location.search("e", response);
							parsePopular();

							$scope.mode="view";
							$scope.share_link = $location.absUrl();
						});
					}
				});
			} else {
				console.log('User cancelled login or did not fully authorize.');
				if ($location.search()['e']) {
					window.location.assign("/?e=" + $location.search()['e']);
				} else {
					window.location.assign("/");
				}
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


    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.shareLink = function() {
    	window.prompt('Copy to clipboard: Ctrl+C, Enter', $location.absUrl());
    }

	$scope.displayPictureModal = function() {
		$scope.img_url = $scope.event_data.picture_url;
		$('#picture-modal').modal('show');
	}

	$scope.saveImageUrl = function(img_url) {
		$scope.event_data.picture_url = img_url;
		ndb.updateEvent($scope.event_data, $location.search()['e']).then(function(response) {
			$('#picture-modal').modal('hide');
		});
	}

	$scope.displayTitleModal = function() {
		$scope.title = $scope.event_data.name;
		$('#title-modal').modal('show');
	}

	$scope.displayTimeModal = function() {
		parseDate();
		console.log($scope.date);

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

	$scope.saveTitle = function(title) {
		$scope.event_data.name = title;
		ndb.updateEvent($scope.event_data, $location.search()['e']).then(function(response) {
			$('#title-modal').modal('hide');
		});
	}

	$scope.displayDescriptionModal = function() {
		$scope.description = $scope.event_data.description;
		$('#desc-modal').modal('show');
	}

	$scope.saveDescription = function(description) {
		$scope.event_data.description = description;
		ndb.updateEvent($scope.event_data, $location.search()['e']).then(function(response) {
			$('#desc-modal').modal('hide');
		});
	}

	$scope.displayLocationModal = function() {
		$scope.location = $scope.popular.location;

		var geocoder = new google.maps.Geocoder();
		var mapOptions = {
			zoom: 10,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		$scope.map = new google.maps.Map(document.getElementById('map-canvas'),
		  mapOptions);

		$scope.showLocation();
		parseLocation();

		$('#location-modal').modal('show');
	}

	$scope.showLocation = function() {
		var geocoder = new google.maps.Geocoder();
		var location = $scope.location;

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

	$scope.removeModal = function() {
		$('#location-modal').modal('hide');
		$('#time-modal').modal('hide');
		$('#title-modal').modal('hide');
		$('#desc-modal').modal('hide');
		$('#picture-modal').modal('hide');
		$('#attendance-modal').modal('hide');
	}

	$scope.addPollOption = function(poll_type, selection) {
		if (poll_type == 'datetime') {
			selection = moment(selection).format();
		}
		ndb.addSelection({
			selection: selection,
			poll: poll_type
		}, $location.search()['e']).then(function(response) {
			$scope.event_data = response;

			if (poll_type == 'datetime') {
				parseDate();
			} else if (poll_type == 'location') {
				parseLocation();
			}
			parsePopular();
		});

	}

	$scope.vote = function(poll_type, selection, color) {
		if (color == '#BCF46E') { //green
			ndb.removeVote({
				user: $scope.user,
				selection: selection,
				poll: poll_type
			}, $location.search()['e']).then(function(response) {
				$scope.event_data = response;

				if (poll_type == 'datetime') {
					parseDate();
				} else if (poll_type == 'location') {
					parseLocation();
				}
				parsePopular();
			});
		} else {
			ndb.addVote({
				user: $scope.user,
				selection: selection,
				poll: poll_type
			}, $location.search()['e']).then(function(response) {
				$scope.event_data = response;

				if (poll_type == 'datetime') {
					parseDate();
				} else if (poll_type == 'location') {
					parseLocation();
				}
				parsePopular();
			});
		}

	}

	function parseDate() {

		$scope.date = {
			poll: $scope.event_data.polls[0].selections
		}

		var total = 0;

		for (var i = 0; i < $scope.date.poll.length; i++) {
			total += $scope.date.poll[i].people.length;
		}

		for (var i = 0; i < $scope.date.poll.length; i++) {
			if (containsID($scope.date.poll[i].people, $scope.user.id)) {
				$scope.date.poll[i].color = '#BCF46E'; // green
			} else {
				$scope.date.poll[i].color = '#DBDBDB'; // grey
			}
			if (total == 0) {
				$scope.date.poll[i].ratio = 0;
			} else {
				$scope.date.poll[i].ratio = ($scope.date.poll[i].people.length / total)*100;
			}
			$scope.date.poll[i].formatted_name = moment($scope.date.poll[i].name).format('MMMM Do, YYYY h:mm A');
		}

	}


	function parseLocation() {

		$scope.locations = {
			poll: $scope.event_data.polls[1].selections
		}

		var total = 0;

		for (var i = 0; i < $scope.locations.poll.length; i++) {
			total += $scope.locations.poll[i].people.length;
		}

		for (var i = 0; i < $scope.locations.poll.length; i++) {
			if (containsID($scope.locations.poll[i].people, $scope.user.id)) {
				$scope.locations.poll[i].color = '#BCF46E'; // green
			} else {
				$scope.locations.poll[i].color = '#DBDBDB'; // grey
			}

			if (total == 0) {
				$scope.locations.poll[i].ratio = 0;
			} else {
				$scope.locations.poll[i].ratio = ($scope.locations.poll[i].people.length / total)*100;
			}
		}

		console.log($scope.locations);

	}

	function containsID(haystack, needle) {
		for (var i = 0; i < haystack.length; i++) {
			if (haystack[i].id == needle) {
				return true;
			}
		}
		return false;
	}

	function parsePopular() {
		// date 
		var dates = $scope.event_data.polls[0].selections;
		var max_index = 0;

		for (var i = 1; i < dates.length; i++) {
			if (dates[i].people.length > dates[max_index].people.length) {
				max_index = i;
			}
		}

		if (dates.length) {
			$scope.popular.datetime = {
				raw: dates[max_index].name,
				date: moment(dates[max_index].name).format('MMMM Do'),
				time: moment(dates[max_index].name).format('h:mm a'),
				year: moment(dates[max_index].name).format('YYYY'),
			}
		} else {
			var now = moment();
			$scope.popular.datetime = {
				raw: now.format(),
				date: now.format('MMMM Do'),
				time: now.format('h:mm a'),
				year: now.format('YYYY'),
			}
		}

		// location
		var locations = $scope.event_data.polls[1].selections;
		var max_index = 0;

		for (var i = 1; i < locations.length; i++) {
			if (locations[i].people.length > locations[max_index].people.length) {
				max_index = i;
			}
		}

		if (locations.length) {
			$scope.popular.location = locations[max_index].name
		} else {
			$scope.popular.location = "University of Pennsylvania";
		}


		console.log("POPULAR: ", $scope.popular);
	}


};