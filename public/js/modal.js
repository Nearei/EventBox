var eventresponse = getResponse();
//Loc
var map;
var geocoder;
var markersArray = [];

function initialize() {
	console.log("hi");
		geocoder = new google.maps.Geocoder();
	  var mapOptions = {
		zoom: 10,
		center: new google.maps.LatLng(eventresponse.events[0].loc.lat, eventresponse.events[0].loc.lon),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	  map = new google.maps.Map(document.getElementById('map-canvas'),
		  mapOptions);
	  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(eventresponse.events[0].loc.lat, eventresponse.events[0].loc.lon),
      map: map,
      title: 'Your Location'
  });
  markersArray.push(marker);
}

function showLocation(){
	var location = document.getElementById('place').value;
	geocoder.geocode( { 'address': location}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			clearOverlays();
		    map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				position: results[0].geometry.location,
				map: map,
				title: 'Your Location'
			});
			markersArray.push(marker);
			console.log('success');
		}else{
		 console.log('fail');
		}
	});
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}

google.maps.event.addDomListener(window, 'load', initialize);


//Time
var html = "";
html += eventresponse.events[0].time+'<br/>'+eventresponse.events[0].date;
document.getElementById('current-time').innerHTML=html;
$(function() {
	$('#date-time-picker').datetimepicker({
		language: 'en',
		pick12HourFormat: true
	});
});