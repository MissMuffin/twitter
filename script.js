$(document).ready(function($) {
	$('#keywords').bind('submit', function(event){
		event.preventDefault();
		var keyword = $('#keySearch').val();
		$('#tweets').html('');
		$('#pictureFrame').html('');
		$('#userDetails').html('');
		//$('#userFollowers').html('');
		$('#tweets').twitterSearch(keyword);
		$('#userSearch').val('');
		$('#keySearch').val('');
	});

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

	$('#keySearch').val('bghackathon');
	$('#keywords').submit();
});		