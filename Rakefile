require 'rspec/core/rake_task'

namespace :db do
	desc "Start MongoDB for development"
	task :start do
		mkdir_p "db"
		system "mongod --port 27017 --dbpath db/"
	end
end

namespace :app do
	desc "Start rackup for development"
	task :start do
		system "rackup"
	end
end

desc "Start MongoDb and rackup"
multitask :start => ['db:start', 'app:start']

desc "Run all RSpec tests"
RSpec::Core::RakeTask.new(:test) do |t|
end
