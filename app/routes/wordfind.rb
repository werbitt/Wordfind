module Wordfind
	class App

		get '/' do
			@games = Game.find(:all).inject([]) {|ary, game| ary << game[:title]}
			haml :index
		end

		get %r{(/\w*)\.css$} do
			content_type 'text/css', :charset => 'utf-8'
			path = File.join 'css', params[:captures].first
			sass path.to_sym
		end

		get '/new' do
			haml :new
		end

		post '/new' do
			title = params['post']['title']
			words = params['post'].select{|k,v| k =~ /word/i}.reject{|k,v| v == ''}.values
			game = Game.create :title => title, :words => words
			game.boards << Board.new(Wordfind::Wordboard.new(words: words))
			game.save
			redirect title
		end

		get '/:game' do
			game = Game.where(:title => params[:game]).first
				if game		
					@game = game['boards'].first 
					@words = game.words
					haml :game
				else
					redirect '/'
				end
		end

		get '/:game/board' do |title|
			game = Game.where(title: title).first
			if game
				@board = game['boards'].first
			  if @board
					haml :board, layout: false	
				else
					# create board
					status 202
					haml :loading
				end
			end
		end


	end
end


