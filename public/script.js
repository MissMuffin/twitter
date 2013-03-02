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
		$('#keySearch').val('');
		return false;
	});


  if (window.location.hostname == "localhost"){
	  $('#tweets').twitterSearch("bghackathon");
  } else {
	  $('#keySearch').val(window.location.pathname);
  }
});
