# frozen_string_literal: true

class StringCalculator
  def add(numbers_str)
    number_list = extract_numbers(numbers_str)
    number_list.sum
  end

  private

  def extract_numbers(numbers_str)
    return [] if numbers_str.empty?

    delimiter = ','
    if numbers_str.start_with?('//')
      delimiter = numbers_str.split('//')[1][0]
      numbers_str = numbers_str.split("\n")[1]
    end

    numbers_str.gsub("\n", delimiter).split(delimiter).map(&:to_i)
  end
end
