		class Board
			include Mongoid::Document
				field :rows, type: Integer
				field :columns, type: Integer
				field :cells, type: Hash, default: {}
				embedded_in :game, :inverse_of => :boards

				def initialize(board)
					super(rows: board.rows, columns: board.columns, words: board.words, cells: board.board)
				end

		end
