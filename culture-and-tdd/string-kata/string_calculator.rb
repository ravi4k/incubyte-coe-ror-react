# frozen_string_literal: true

class StringCalculator
  DEFAULT_DELIMITER = ','
  CUSTOM_DELIMITER_PREFIX = '//'

  def add(numbers_str)
    number_list = extract_numbers(numbers_str)
    number_list.sum
  end

  private

  def extract_numbers(numbers_str)
    return [] if numbers_str.empty?

    delimiter, numbers = split_delimiter_and_numbers(numbers_str)
    numbers.split(delimiter).map(&:to_i)
  end

  def split_delimiter_and_numbers(numbers_str)
    delimiter = DEFAULT_DELIMITER
    if numbers_str.start_with?(CUSTOM_DELIMITER_PREFIX)
      delimiter = numbers_str.split(CUSTOM_DELIMITER_PREFIX)[1][0]
      numbers_str = numbers_str.split("\n")[1]
    else
      numbers_str = numbers_str.gsub("\n", delimiter)
    end

    [delimiter, numbers_str]
  end
end
