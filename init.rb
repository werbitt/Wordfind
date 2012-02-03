$:.unshift File.expand_path(File.dirname(__FILE__))

require 'rubygems'
require 'bundler'
Bundler.require

module Wordfind
	class App < Sinatra::Base
		enable :sessions

		if development?
			set :show_exceptions, true
			register Sinatra::Reloader
		end

		dir = File.expand_path(File.dirname(__FILE__))
		
		# Setup haml
		set :views, File.join(dir, 'app', 'views')
		set :public, File.join(dir, 'app', 'public')
		

		# Setup mongoid
		file = File.join(dir, "config", "mongoid.yml")
		@config = YAML.load(ERB.new(File.new(file).read).result)

		Mongoid.configure do |config|
		 	config.from_hash(@config[ENV['RACK_ENV']])
		end

		# Load routes
    Dir[File.join(dir, "app/routes/*.rb")].each do |file|
			require file
		end

    Dir[File.join(dir, "app/models/*.rb")].each do |file|
			require file
		end

    Dir[File.join(dir, "lib/*.rb")].each do |file|
			require file
		end
	
	end
end
