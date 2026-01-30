# frozen_string_literal: true

class StringCalculator
  def add(numbers_str)
    number_list = extract_numbers(numbers_str)
    number_list.sum
  end

  private

  def extract_numbers(numbers_str)
    return [] if numbers_str.empty?

    numbers_str.gsub("\n", ',').split(',').map(&:to_i)
  end
end
