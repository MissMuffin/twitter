/**
 * super-simple twitter timeline boilerplate
 */

(function($) {

	//
	// -- Private ------------------------------------------------------------------------------------------------------------------
	//

	var tweetTemplate = '<li class=CLASS><img class="tweetUserPic" src="imgURL" ><em id="tweeter">USER</em>: <p id="tweetText">CONTENT</p><div class="time">TIME</div></li>';
	var $container = null;

	/**
		* load some tweets using the user_timeline API
		* documentation: https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
		* @param {string} twitter user name (scren name with or without the @-prefix)
		*/
	function loadTweets(keyword, host) {
    //console.log("keyword is" + keyword);
    //console.log("host is" + host);
		$.ajax({
      url: host + '/users/' + keyword,
			type: 'GET',
			success: displayUsers
		});
	};


	function displayUsers(users) {
			var userList = [];
    //console.log("num users: "+users.length);
    //console.log(users);
		for (var i = 0; i < users.length; i++){

			var userData = {};

			//check if array already contains an object, add if not
		//	for(var k = 0; k < userList.length; k++){
		//		if (!userList[k][userName].contains(users[i].from_user)){

					//set attributes to array objects
					userData["profileImageUrl"] = users[i].profile_image_url;
					userData["id"] = users[i].id;
					userData["username"] = users[i].username;
					userData["lastTweet"] = users[i].last_tweet.text;

					userList.push(userData);
		//		}

			//if (!containsUser(users[i]["username"])){
			//userList.push(userData);
			//}
			}

		//$.unique(userList);

		for (var j = 0; j < userList.length; j++){

			$("#users").append('<div class="userField"><img src="' + userList[j]["profileImageUrl"] + '" class="userImage" /><div class="userTweets hidden">' + userList[j]["lastTweet"] + '</div><div class="imageName">@' + userList[j]["username"] + '</div></div>');
		}

		//onclick action



var margin =$(".userImage").width()/2;
var width=$(".userImage").width();
var height=$(".userImage").height();

$(".userTweets").stop().css({width:'0px',height:''+height+'px',marginLeft:''+margin+'px',opacity:'0.5'});
//$("#reflection2").stop().css({width:'0px',height:''+height+'px',marginLeft:''+margin+'px'});

$(".userField").click(function(){
	var field = this;
        $(field).find('.userImage').stop().animate({width:'0px',height:''+height+'px',marginLeft:''+margin+'px',opacity:'0.5'},{duration:500});
        window.setTimeout(function() {
        	$(field).find('.userTweets').removeClass('hidden');
        $(".userTweets").stop().animate({width:''+width+'px',height:''+height+'px',opacity:'1'},{duration:500});
        },500);

 
    $(".userField").click(function(){
    	var field = this;
        $(field).find('.userTweets').stop().animate({opacity:'0.5'},{duration:500});
        window.setTimeout(function() {
        	$(field).find('.userTweets').addClass('hidden');
        $(".userImage").stop().animate({opacity:'1'},{duration:500});
        },500);
    });
        });







		//$('.userImage').bind('click', function(){
		//	$(this).flip({
		//		direction:'tb',
		//		content: 'test'
		//	});
		//});
	};


	//
	// -- Private utility functions ------------------------------------------------------------------------------------------------------------------
	//	the following two functions are helpers for formatting entries. You probably shouldn't change any of that code.

	/**
		* relative time calculator
		* borrowed from http://twitter.com/javascripts/widgets/widget.js
		* @param {string} twitter date string returned from Twitter API
		* @return {string} relative time like "2 minutes ago"
		*/
	function timeAgo(dateString) {
			var rightNow = new Date();
			var then = new Date(dateString);

			if ($.browser.msie) {
				// IE can't parse these crazy Ruby dates
				then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
			}

			var diff = rightNow - then;

			var second = 1000,
					minute = second * 60,
					hour = minute * 60,
					day = hour * 24,
					week = day * 7;

			if (isNaN(diff) || diff < 0) {
				return ""; // return funktionnk string if unknown
			}

			if (diff < second * 2) {
				// within 2 seconds
				return "right now";
			}

			if (diff < minute) {
				return Math.floor(diff / second) + " seconds ago";
			}

			if (diff < minute * 2) {
				return "about 1 minute ago";
			}

			if (diff < hour) {
				return Math.floor(diff / minute) + " minutes ago";
			}

			if (diff < hour * 2) {
				return "about 1 hour ago";
			}

			if (diff < day) {
				return	Math.floor(diff / hour) + " hours ago";
			}

			if (diff > day && diff < day * 2) {
				return "yesterday";
			}

			if (diff < day * 365) {
				return Math.floor(diff / day) + " days ago";
			}

			else {
				return "over a year ago";
			}

		};


		/**
			* The Twitalinkahashifyer!
			* borrowed from http://twitter.com/javascripts/widgets/widget.js
			* more info: http://dustindiaz.com/linkified-tweets
			* Usage:
			* ify.clean('your tweet text');
			*/
		var ify = {
			link: function(tweet) {
				return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
					var http = m2.match(/w/) ? 'http://' : '';
					return '<a class="twtr-hyperlink" target="_funktionnk" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
				});
			},

			at: function(tweet) {
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
					return '<a target="_funktionnk" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
				});
			},

			list: function(tweet) {
				return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
					return '<a target="_funktionnk" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
				});
			},

			hash: function(tweet) {
				return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
					return before + '<a target="_funktionnk" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
				});
			},

			clean: function(tweet) {
				return this.hash(this.at(this.list(this.link(tweet))));
			}
		}



	//
	// -- Public ------------------------------------------------------------------------------------------------------------------
	//

	/**
		* Initialize the timeline (public)
		* @param {string} twitter user name (scren name with or without the @-prefix)
		*/
	$.fn.twitterSearch = function(keyword, host) {

		$container = $(this);
		loadTweets(keyword,host);
	};

})(jQuery);
