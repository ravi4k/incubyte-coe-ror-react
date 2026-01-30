# JavaScript ES6 & React Introduction

## JavaScript

### Arrow Functions and Lexical `this`

**Traditional Function vs Arrow Function:**
```javascript
function add(a, b) {
  return a + b;
}

const add = (a, b) => a + b;
```

**Key Insights:**
- Arrow functions provide shorter syntax for writing function expressions
- They don't have their own `this` binding, they inherit `this` from the parent scope
- Cannot be used as constructors

---

### Destructuring (Objects and Arrays)

**Object Destructuring:**
```javascript
const user = { name: 'John', age: 30, email: 'john@example.com' };
const { name, age } = user;
```

**Array Destructuring:**
```javascript
const colors = ['red', 'green', 'blue'];
const [first, second] = colors;

const [primary, , tertiary] = colors;

const [head, ...rest] = colors;
```

**Key Benefits:**
- Extract multiple properties/values in one statement
- Works with function parameters
- Reduces repetitive code

---

**Expression Evaluation:**
```javascript
const price = 19.99;
const tax = 0.08;
console.log(`Total: $${(price * (1 + tax)).toFixed(2)}`);
```

**Key Features:**
- Use backticks (`` ` ``) instead of quotes
- Embed expressions with `${expression}`
- Support multi-line strings naturally

---

### Promises and Async/Await Basics

**Promises:**
```javascript
// Creating a promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: 'Success!' });
    }, 1000);
  });
};

// Consuming a promise
fetchData()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

**Promise States:**
- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

**Async/Await:**
```javascript
// Async function always returns a promise
async function getData() {
  try {
    const response = await fetchData();
    const result = await processData(response);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Key Benefits:**
- Handle asynchronous operations without callback hell
- `async/await` makes asynchronous code look synchronous
- Better error handling with try/catch
- Cleaner and more maintainable code

---

### ES6 Modules (Import/Export)

**Named Exports:**
```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// main.js
import { add, subtract } from './math.js';
```

**Default Exports:**
```javascript
// calculator.js
const Calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
export default Calculator;

// main.js
import Calculator from './calculator.js';
```

**Mixed Exports:**
```javascript
// utils.js
export const helper = () => { /* ... */ };
export default class MainUtil { /* ... */ }

// main.js
import MainUtil, { helper } from './utils.js';
```

**Key Features:**
- Organize code into reusable modules
- Better dependency management
- Tree-shaking for optimized bundles
- Clear separation of concerns

---

## React Overview

### Component-Based Architecture

**What are Components?**
- Self-contained, reusable pieces of UI
- Manage their own state and logic
- Can be composed together to build complex UIs

**Component Hierarchy:**
```
App
├── Header
│   ├── Logo
│   └── Navigation
├── Main
│   ├── Sidebar
│   └── Content
│       ├── Article
│       └── Comments
└── Footer
```

**Benefits:**
- **Reusability**: Write once, use everywhere
- **Maintainability**: Isolated components are easier to update
- **Testability**: Test components independently
- **Separation of Concerns**: Each component has a single responsibility

**Types of Components:**
- **Functional Components**: Simple functions that return JSX
- **Class Components**: ES6 classes (legacy, less common now)

---

### JSX Introduction and Syntax Basics

**What is JSX?**
JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files.

**JSX with Expressions:**
```javascript
const name = 'John';
const element = <h1>Hello, {name}!</h1>;

const result = <div>{2 + 2}</div>; // Displays: 4
```

**JSX Attributes:**
```javascript
// Use camelCase for attributes
const element = <div className="container" id="main">Content</div>;

// Dynamic attributes
const imageUrl = 'path/to/image.jpg';
const image = <img src={imageUrl} alt="Description" />;
```
