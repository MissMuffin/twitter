require 'rubygems'
require 'sinatra'
require 'httparty'
require 'json'
require 'open-uri'

set :public_folder, 'public'

get "/:hashtag" do
  File.read('public/index.html')
end

get "/users/:hashtag" do
  keyword = URI::encode(params[:hashtag])
  response = HTTParty.get("http://search.twitter.com/search.json?q=#{keyword}")
  users = response["results"].map{|t| to_user(t)}
  users = users.uniq{|u| u[:id]}
  users.to_json
end

private
def to_user(tweet_hash)
  { :username=> tweet_hash["from_user_name"],
    :profile_image_url => tweet_hash["profile_image_url"],
    :id => tweet_hash["from_user_id"]
  }
end
