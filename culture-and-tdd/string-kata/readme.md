# String Calculator Kata
This is a simple implementation of the String Calculator Kata, a coding exercise designed to practice TDD (Test-Driven Development).

## Approach
- The implementation follows the TDD approach, where tests are written before the actual code.
- Each requirement is addressed with a corresponding test case to ensure correctness.
- TDD cycle of Red-Green-Refactor is followed throughout the development process.

## Requirements
- Step 1
  - Create a method `add` that takes a string of numbers separated by commas and returns their sum.
  - An empty string should return 0.
  - A single number should return the value of that number.
- Step 2
  - Handle unknown amount of numbers.
- Step 3
  - Handle new lines between numbers (e.g., "1\n2,3" should return 6).

## Structure
- The project is structured with a main class `StringCalculator` that contains the method `add`.
- A separate test class `StringCalculatorTests` is created to hold all the test cases.

## Usage
- To use the String Calculator, create an instance of the `StringCalculator` class and call the `add` method with a string input.
- To run the tests, run the tests in the `StringCalculatorTests` class.


