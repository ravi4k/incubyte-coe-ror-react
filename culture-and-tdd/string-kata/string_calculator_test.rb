# frozen_string_literal: true

require 'minitest/autorun'
require_relative 'string_calculator'

class StringCalculatorTest < Minitest::Test
  def setup
    @calculator = StringCalculator.new
  end

  def test_instance
    assert_instance_of StringCalculator, @calculator
    assert_respond_to @calculator, :add
  end

  def test_add_numbers
    assert_equal @calculator.add('1,2,3'), 6
    assert_equal @calculator.add('10,20,30'), 60
  end

  def test_add_empty_string
    assert_equal @calculator.add(''), 0
  end

  def test_add_single_number
    assert_equal @calculator.add('5'), 5
  end

  def test_handle_newlines
    assert_equal @calculator.add("1\n2,3"), 6
  end

  def test_handle_multiple_newlines
    assert_equal @calculator.add("//;\n1;2;3;4"), 10
  end
end
