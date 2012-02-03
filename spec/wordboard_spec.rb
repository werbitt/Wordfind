require File.join(File.dirname(__FILE__),'spec_helper.rb')
require 'wordboard'

module Wordfind

	describe Wordboard do

		describe "#rows" do
			it "returns the number of rows on the bord" do
				wordboard = Wordboard.new(rows: 4)
				wordboard.rows.should == 4
			end
		end

		describe "#columns" do
			it "returns the number of columns on the board" do
				wordboard = Wordboard.new(columns: 5)
				wordboard.columns.should == 5
			end
		end

		describe "#board" do
			it "returns an Array of Arrays" do
				wordboard = Wordboard.new
				wordboard.board.should be_an(Array)
				wordboard.board.first.should be_an(Array)
			end
		end

		describe "#cell(row, col)" do
			it "returns a cell hash " do
				cell = Wordboard.new.cell(1,1)

				cell.should be_a(Hash)
				cell.should have_key(:letter)
				cell.should have_key(:words)
			end
		end

		describe "#board=" do
			it "should start with an empty board" do
				pending
			end
		end


	end

end
