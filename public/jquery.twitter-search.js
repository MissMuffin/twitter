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
	function loadTweets(keyword) {
		$.ajax({
			url: 'http://search.twitter.com/search.json',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				q: keyword
			},
			success: displayUsers
		});
	};

	/**
		* add tweets to the DOM using a simple template
		* @param {object} data returned from Twitter API
		*/
	function displayTweets(data) {
		for (var i = 0; i < data.results.length; i++) {
			var tweetKlasse = "tweet";
			var content = ify.clean(data.results[i].text);
			var user = data.results[i].from_user;

			if(content.indexOf('RT')===0){
				tweetKlasse = "retweet";
			}
			var tweet = tweetTemplate
				.replace('ID', user)
				.replace('CLASS', tweetKlasse)
				.replace('imgURL', data.results[i].profile_image_url)
				.replace('USER', user)
				.replace('CONTENT', content)
				.replace('TIME', timeAgo(data.results[i].created_at));

			var $tweet = $(tweet);
			$tweet.data("user", user)
			$tweet.click(function(){
				$('#pictureFrame').html('');
				$('#userDetails').html('');
				bioData($(this).data("user"));
			});


			$container.append($tweet);

		};
		displayUsers(data);
	};

	function displayUsers(data) {
			var userList = [];

			var profileLink = "";
			var profileImageUrl = "";
			var uid = "";
			var userName = "";

		console.log(data);

		for (var i = 0; i < data.results.length; i++){



			var userData = {};
			
			userData["profileImageUrl"] = data.results[i].profile_image_url;
			userData["uid"] = data.results[i].from_user_id;
			userData["userName"] = data.results[i].from_user;

			userList.push(userData);

		}

		$.unique(userList);
		
		console.log(userList);
		
		for (var j = 0; j < userList.length; j++){

			$("#tweetFrame").append('<li><img src="' + userList[j]["profileImageUrl"] + '" /></li>');
			//console.log(userList[j].profile_image_url);
		}
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
	$.fn.twitterSearch = function(keyword) {

		$container = $(this);
		loadTweets(keyword);
	};

})(jQuery);