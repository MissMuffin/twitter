$(document).ready(function($) {
	$('#keywords').bind('submit', function(event){
		event.preventDefault();
		var keyword = $('#keySearch').val();
		$('#tweets').html('');
		$('#pictureFrame').html('');
		$('#userDetails').html('');
		$('#tweets').twitterSearch(keyword);
		$('#keySearch').val('');
	});

	$("#userName").submit(function(){
		var user = $("#userSearch").val();
		$('#tweets').html('');
		$('#pictureFrame').html('');
		$('#userDetails').html('');
		$("#tweets").twitterTimeline("@"+user);
		bioData(user);
		$('userSearch').val('');
		return false;
	});
});		