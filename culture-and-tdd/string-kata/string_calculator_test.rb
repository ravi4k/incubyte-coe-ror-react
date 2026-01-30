# frozen_string_literal: true

require 'minitest/autorun'
require_relative 'string_calculator'

class StringCalculatorTest < Minitest::Test
  def setup
    @calculator = StringCalculator.new
  end

  def test_add_numbers
    assert_equal @calculator.add('1,2,3'), 6
    assert_equal @calculator.add('10,20,30'), 60
  end
end
