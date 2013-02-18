function bioData(user){
	$.ajax({
		url: 'https://api.twitter.com/1/users/show.json',
		type: 'GET',
		dataType: 'jsonp',
		data: {
			screen_name: user,
			include_entities: true
		},			
		success: showBio
	});
};

function showBio(data){
	console.log(data);
	var user = data;
	$('#pictureFrame').append('<img id="user_picture" src="'+user.profile_image_url+'"">');
	var profile = "<li id='user_name'>"+user.name+"</li>"
				 +"<li id='user_screen_name'>@"+user.screen_name+"</li>"
				 +"<li id='user_description'>"+user.description+"</li>";
	$('#userDetails').append(profile);
};