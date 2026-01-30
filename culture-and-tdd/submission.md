# Culture, TDD & Solid Foundations - Learning


## TDD

### The Three Laws

1.  You may not write production code until you have written a failing unit test
2.  You may not write more of a unit test than is sufficient to fail
3.  You may not write more production code than is sufficient to pass the currently failing test

### Key Insights

- TDD creates a feedback loop that catches bugs early
- Tests serve as documentation of the system's behavior
- It leads to better design through incremental development
- Small, frequent cycles reduce debugging time and increase predictability

### Phase Details

#### RED - Write a Failing Test
- Write a test that describes the behavior you want
- The test should fail because the feature doesn't exist yet

#### GREEN - Make It Pass
- Write the minimum code necessary to pass the test
- Don't add extra features or complexity yet

#### REFACTOR - Improve the Code
- Clean up the code while keeping tests green
- Refactor and apply design patterns where appropriate

---

## SOLID Principles

### Overview

- 5 principles for maintainable, scalable, testable code
- Help in enhancing loose coupling. Loose coupling means a group of classes are less dependent on one another.
- Encourage better organization and structure in codebases

### Principles

#### Single Responsibility Principle (SRP)
- Each class/module should do one thing well
- Makes code easier to test, understand, and maintain
- Changes in one area don't affect unrelated code

#### Open/Closed Principle (OCP)
- Design systems that can be extended without modifying existing code
- Use abstraction and polymorphism to achieve this

#### Liskov Substitution Principle (LSP)
- Subclasses should honor the structure of their parent classes
- Subclasses must be replaceable for base classes
- Encourages proper use of inheritance

#### Interface Segregation Principle (ISP)
- Keep interfaces small and focused
- Clients shouldn't need to implement methods they don't use
- Leads to more decoupled systems

#### Dependency Inversion Principle (DIP)
- High level modules should not depend on low level modules
- Should depend on abstractions, not concrete classes
- Makes mocking and testing easier

---

## Incubyte's Care for Craft

### Core Values

- **Relentless Pursuit of Quality with Pragmatism:** Maintain high standards, balance ambition with practicality.
- **Extreme Ownership:** Owning your work and its outcomes
- **Collaboration:** Pair programming and code reviews as learning tools
- **Active Pursuit of Mastery**: Continuous learning and skill improvement
- **Create Ecstatic Customers:** Our clients' success is our success

---

## 5. Craftsperson Mindset

### Characteristics

- Attention to Detail: Care about the small things that impact quality
- Dedication to Excellence: Strive for the best possible outcome
- Continuous Growth: Always seek to learn and improve
- Adaptive Innovation: Embrace new tools and methodologies
- Responsibility: Take ownership of your work and its impact