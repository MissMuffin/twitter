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

get "/mongo" do
  @db = get_connection
  @coll   = @db['test']

  3.times do |i|
      @coll.insert({'a' => i+1})
  end
  "There are #{@coll.count} records."
end


get "/:hashtag" do
  File.read('public/index.html')
end

get "/users/:hashtag" do
  keyword = URI::encode("#" + params[:hashtag])
  response = HTTParty.get("http://search.twitter.com/search.json?q=#{keyword}&rpp=100")
  users = response["results"].map{|t| to_user(t)}
  users = users.uniq{|u| u[:id]}

  status 200
  headers({ "Content-Type" => "application/json",
          "Access-Control-Allow-Origin" =>  "*"
  })
  body users.to_json
end

private
def to_user(tweet_hash)
  { :username=> tweet_hash["from_user_name"],
    :profile_image_url => tweet_hash["profile_image_url"],
    :id => tweet_hash["from_user_id"]
  }
end
