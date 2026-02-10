# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    field :fizzbuzz, String, null: false, description: "Returns FizzBuzz result for a given number" do
      argument :number, Integer, required: true
    end

    def fizzbuzz(number:)
      if number % 15 == 0
        "FizzBuzz"
      elsif number % 3 == 0
        "Fizz"
      elsif number % 5 == 0
        "Buzz"
      else
        number.to_s
      end
    end

    field :fizzbuzz_range, [String], null: false, description: "Returns FizzBuzz results for numbers 1 to n" do
      argument :n, Integer, required: true
    end

    def fizzbuzz_range(n:)
      (1..n).map do |number|
        if number % 15 == 0
          "FizzBuzz"
        elsif number % 3 == 0
          "Fizz"
        elsif number % 5 == 0
          "Buzz"
        else
          number.to_s
        end
      end
    end
  end
end
