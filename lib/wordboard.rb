module Wordfind
	class Wordboard
		WORD_TRIES=250
		BOARD_TRIES=500

		attr_reader :words, :board, :rows, :columns
		
		def initialize(args={})
			@words ||= args[:words] || []
			@rows ||= [args[:rows], longest_word_length].compact.max || 10   
			@columns ||= [args[:columns], longest_word_length].compact.max || 10

			@board = matrix(@rows, @columns) 
			place_words
		end

		def matrix(rows, columns)
			Array.new(rows) do
				 Array.new(columns){{letter: random_letter, words: []}}
			end
		end
		
		def longest_word_length
			@words.map{|word| word.size}.max
		end
		
		def cells
			@board.flatten
		end
		
		def place_words(args={})
			tries = args[:tries] || BOARD_TRIES 
			@words.each do |word| 
				begin
					place(word)
				rescue WordPlacingError
					if tries > 0
						tries -= 1
						@board = matrix(@rows, @columns)
						place_words(tries: tries -= 1)
					else
						@rows = (@rows * 1.1).ceil
						@columns = (@columns * 1.1).ceil
						@board = matrix(rows, columns)
						place_words
					end
				end 
			end    
		end
		
		def place(word, args={})
			row = args[:row] || rand(@rows) + 1
			column = args[:column] || rand(@columns) + 1
			direction = args[:direction] || rand(8) + 1
			tries = args[:tries] || WORD_TRIES
			
			if word_fits(word, row, column, direction)
				
				word.split(//).each_with_index do |letter, index|
					new_row = offset_row(index, row, direction)
					new_column = offset_column(index, column, direction)
					set_cell(new_row, new_column, letter, word)
				end
			else
				if tries > 0
					place(word,{:tries => tries -= 1 })
				else
					raise WordPlacingError, "Coldn't place #{word}", caller
				end
			end
		end
		
		def set_cell( row, column, letter, word )
			#p row
			#p column
			cell(row, column)[:letter] = letter.upcase
			cell(row, column)[:words] << word
		end
		
		def word_fits( *args ) 
			true if length_fits(*args) && overlap(*args)
		end
		
		def length_fits( word, row, column, direction )
			length = word.size
			case direction
				when 1 then true unless ( row < length || column < length )
				when 2 then true unless row < length
				when 3 then true unless ( row < length || @columns + 1 - column < length )
				when 4 then true unless ( column < length )
				when 5 then true unless @columns + 1 - column < length
				when 6 then true unless ( @rows + 1 - row < length || column < length )
				when 7 then true unless @rows + 1 - row < length
				when 8 then true unless ( @rows + 1 - row < length || @columns + 1 - column < length )
			end
		end
		
		def overlap( word, row, column, direction )
			overlaps = 0
			word.split(//).each_with_index do |letter, index|
				new_row = offset_row( index, row, direction )
				new_column = offset_column( index, column, direction )
				if cell(new_row, new_column)[:words].size > 0
					overlaps += 1 unless cell(new_row, new_column)[:letter] == letter
				end
			end
			true unless overlaps > 0
		end
		
		
		def cell( row, column )
			@board[row - 1][column - 1]
		end
		
		def offset_row( offset, row, direction )
			case direction
				when 1..3 then row - offset
				when 4..5 then row
				when 6..8 then row + offset
			end
		end

		def offset_column( offset, column, direction )
			case direction
				when 1, 4, 6 then column - offset
				when 2, 7 then column
				when 3, 5, 8 then column + offset
			end
		end
	
		def pp
			 @board.each do |row|
				( @columns * 4 + 1 ).times { print "-" }
				print "\n"
				print "|"
				row.each do |cell|
					if cell[:letter] == ""
						print "   |"
					else
						print " #{cell[:letter]} |"
					end
				end
				print "\n"
			end
			( @columns * 4 + 1 ).times { print "-" }
		end

		def random_letter
			(rand(122-97) + 97).chr.upcase
		end
	
	end
	

	class WordPlacingError < StandardError
	end
end
