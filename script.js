$(document).ready(function($) {
	$('#keywords').bind('submit', function(event){
		event.preventDefault();
		var keyword = $('#keySearch').val();
		$('#tweets').twitterSearch(keyword);
	});

	$("#userName").submit(function(){
		var userSearchText = $("#userSearch").val();
		$("#tweets").twitterTimeline("@"+userSearchText);
		return false;
	});
});		