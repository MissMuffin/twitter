require 'rubygems'
require 'sinatra'
require 'httparty'
require 'json'
require 'open-uri'
require 'mongo'

include Mongo

set :public_folder, 'public'

get "/" do
  File.read('public/root.html')
end

get "/:hashtag" do
  File.read('public/index.html')
end

get "/users/:hashtag" do
  hashtag = params[:hashtag]

  if Time.now.to_i - last_update_time(hashtag) > ENV['CACHE_TWEETS_SECONDS'].to_i
    puts "updating users"
    update_users(hashtag)
    update_timestamp(hashtag)
  end

  users = get_all_users(hashtag).sort{|a,b| a["display_name"] <=> b["display_name"]}

  status 200
  headers({
    "Content-Type" => "application/json",
    "Access-Control-Allow-Origin" =>  "*"
  })
  body users.to_json
end

private

def get_connection
  return @db_connection if @db_connection
  db = URI.parse(ENV['MONGOHQ_URL'])
  db_name = db.path.gsub(/^\//, '')
  @db_connection = Mongo::Connection.new(db.host, db.port).db(db_name)
  @db_connection.authenticate(db.user, db.password) unless (db.user.nil? || db.user.nil?)
  @db_connection
end

def last_update_time(hashtag)
  @db = get_connection
  coll = @db['timestamps']
  timestamp = coll.find_one({"hashtag"=> hashtag})
  timestamp ? timestamp["last_update_time"] : 0
end

def update_timestamp(hashtag)
  @db = get_connection
  coll = @db['timestamps']
  timestamp = coll.find_one({"hashtag" => hashtag})
  if timestamp
    coll.update({"hashtag" => hashtag},{"hashtag" => hashtag, :last_update_time => Time.now.to_i})
  else
    # is there an update else insert mng method?
    coll.insert({"hashtag" => hashtag, :last_update_time => Time.now.to_i})
  end
end

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

def update_users(hashtag)
  tweets = get_tweets(hashtag)
  tweets.each do |t|
    user = get_user(hashtag, t["from_user_id"])
    if !user
      store_user(hashtag, to_user(t))
    end
  end
end

def get_tweets(hashtag)
  keyword = URI::encode("#" + hashtag)
  tweets = []
  response = HTTParty.get("http://search.twitter.com/search.json?q=#{keyword}&rpp=100")

  i = 2
  while response["results"].length != 0 && i < 5
    tweets += response["results"]
    response = HTTParty.get("http://search.twitter.com/search.json?q=#{keyword}&rpp=100&page=#{i}")
    i+=1
  end
  tweets
end

def to_user(tweet_hash)
  { :username=> tweet_hash["from_user"],
    :display_name => tweet_hash["from_user_name"],
    :profile_image_url => tweet_hash["profile_image_url"],
    :twitter_id => tweet_hash["from_user_id"],
    :last_tweet => {
      :text => tweet_hash["text"],
      :twitter_id => tweet_hash["id"],
    }
  }
end
