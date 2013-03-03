require 'rubygems'
require 'sinatra'
require 'httparty'
require 'json'
require 'open-uri'
require 'mongo'

include Mongo

set :public_folder, 'public'

def get_connection
  return @db_connection if @db_connection
  db = URI.parse(ENV['MONGOHQ_URL'])
  db_name = db.path.gsub(/^\//, '')
  @db_connection = Mongo::Connection.new(db.host, db.port).db(db_name)
  @db_connection.authenticate(db.user, db.password) unless (db.user.nil? || db.user.nil?)
  @db_connection
end

get "/:hashtag" do
  File.read('public/index.html')
end

get "/users/:hashtag" do
  hashtag = params[:hashtag]
  tweets = get_tweets(hashtag)

  tweets.each do |t|
    user = get_user(hashtag, t["from_user_id"])
    if !user
      store_user(hashtag, to_user(t))
    end
  end

  users = get_all_users(hashtag)

  status 200
  headers({ "Content-Type" => "application/json",
          "Access-Control-Allow-Origin" =>  "*"
  })
  body users.to_json
end

private

def get_collection(hashtag)
  @db = get_connection
  coll = @db['users.' + hashtag]
end

def store_user(hashtag, user)
  get_collection(hashtag).insert(user)
end

def get_user(hashtag, twitter_id)
  get_collection(hashtag).find_one("twitter_id" => twitter_id)
end

def get_all_users(hashtag)
  get_collection(hashtag).find.to_a
end

def get_tweets(hashtag)
  keyword = URI::encode("#" + hashtag)
  response = HTTParty.get("http://search.twitter.com/search.json?q=#{keyword}&rpp=100")
  response["results"]
end

def to_user(tweet_hash)
  { :username=> tweet_hash["from_user_name"],
    :profile_image_url => tweet_hash["profile_image_url"],
    :twitter_id => tweet_hash["from_user_id"],
    :last_tweet => {
      :text => tweet_hash["text"],
      :twitter_id => tweet_hash["id"],
    }
  }
end
