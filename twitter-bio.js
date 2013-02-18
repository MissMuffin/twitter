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
	getFollowers(user.screen_name);

};

function getFollowers(user){
		$.ajax({
			url: 'https://api.twitter.com/1/followers/ids.json?' ,
			type: 'GET',
			dataType: 'jsonp',
			data:{
				screen_name: user,


			},
			success: getFollowerName



		});

};

function getFollowerName(data){
		console.log(data);
		var followerImg = null;
		for(var i = 0 ; i<data.ids.length; i++){
			$.ajax({
				url: 'https://api.twitter.com/1/users/show.json',
				type: 'GET',
				dataType: 'jsonp',
				data: {
					id: data.ids[i]
				},
				success: getFollowerPic

			});
		};

};	

function getFollowerPic(data){
		console.log(data);
		$('#userFollowers').append('<a href="http://twitter.com/'+data.screen_name+'" target="blank"><img src="'+data.profile_image_url+'"></a>')

}
