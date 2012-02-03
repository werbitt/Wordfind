		class Game
			include Mongoid::Document
				field :title
				field :words, type: Array, default: []
				embeds_many :boards

		end
