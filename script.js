$(document).ready(function($) {
	$('#keywords').bind('submit', function(event){
		event.preventDefault();
		var keyword = $('#keySearch').val();
		$('#tweets').html('');
		$('#tweets').twitterSearch(keyword);
	});

	$("#userName").submit(function(){
		var userSearchText = $("#userSearch").val();
		$('#tweets').html('');
		$("#tweets").twitterTimeline("@"+userSearchText);
		return false;
	});
});		