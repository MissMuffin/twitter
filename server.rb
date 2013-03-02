require 'rubygems'
require 'sinatra'

set :public_folder, 'public'

get "/:hashtag" do
  File.read('public/index.html')
end

