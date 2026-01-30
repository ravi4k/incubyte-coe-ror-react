# frozen_string_literal: true

class StringCalculator
  def add(numbers)
    numbers = numbers.gsub("\n", ',')
    numbers.split(',').map(&:to_i).sum
  end
end
