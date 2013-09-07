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

  function loginSuccess (){
	window.location.href = "dashboard";
  }