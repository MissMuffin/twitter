$(document).ready(function($) {

	$("#userName").submit(function(){
		var user = $("#userSearch").val();
		$('#tweets').html('');
		$('#pictureFrame').html('');
		$('#userDetails').html('');
		//$('#userFollowers').html('');
		$("#tweets").twitterTimeline("@"+user);
		bioData(user);
		$('#userSearch').val('');
		return false;
	});


  if (window.location.origin.indexOf("file") == 0  || window.location.hostname == ""){ // running locally
	  $('#tweets').twitterSearch("bghackathon", "http://weru.herokuapp.com");
  } else { // we are running on heroku
	  $('#tweets').twitterSearch(window.location.pathname, "");
  }


});
