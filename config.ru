#!/usr/bin/env ruby

$:.unshift File.dirname(__FILE__)
require 'init'

use Rack::ShowExceptions

run Wordfind::App.new
