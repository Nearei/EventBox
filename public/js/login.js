  window.fbAsyncInit = function() {
	  FB.init({
		appId      : '654824984529366', // App ID
		channelUrl : '//localhost:8080/kevin.html', // Channel File
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	  });
  };
  function loginAttempt (){
	  FB.login(function(response) {
		if (response.authResponse) {
		  loginSuccess ();
		} else {
		  console.log("Authentication Failed");
		}
	  });
  }

  // Load the SDK asynchronously
  (function(d){
	  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	  if (d.getElementById(id)) {return;}
	  js = d.createElement('script'); js.id = id; js.async = true;
	  js.src = "//connect.facebook.net/en_US/all.js";
	  ref.parentNode.insertBefore(js, ref);
  }(document));

function get_param(param) {
   var search = window.location.search.substring(1);
   var compareKeyValuePair = function(pair) {
      var key_value = pair.split('=');
      var decodedKey = decodeURIComponent(key_value[0]);
      var decodedValue = decodeURIComponent(key_value[1]);
      if(decodedKey == param) return decodedValue;
      return null;
   };

   var comparisonResult = null;

   if(search.indexOf('&') > -1) {
      var params = search.split('&');
      for(var i = 0; i < params.length; i++) {
         comparisonResult = compareKeyValuePair(params[i]); 
         if(comparisonResult !== null) {
            break;
         }
      }
   } else {
      comparisonResult = compareKeyValuePair(search);
   }

   return comparisonResult;
}
  function loginSuccess (){
  	var event_param = get_param('e');
  	if (event_param) {
		window.location.href = "event/#?e=" + event_param;
  	} else {
		window.location.href = "event/";
  	}
  }