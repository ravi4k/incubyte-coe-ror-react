# React Testing with TDD

Learn how to write tests first when building React applications. This guide covers Jest, React Testing Library, and the red-green-refactor cycle.

## TDD Cycle: Red-Green-Refactor

The core of TDD is a simple cycle:

1. **Red**: Write a failing test for the feature you want
2. **Green**: Write the minimum code to make the test pass
3. **Refactor**: Clean up the code while keeping tests green

This forces you to think about what your code should do before writing it.

## Writing Your First Test

Tests go in files ending with `.test.tsx` or `.spec.tsx`. Here's a basic structure:

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders a heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
```

## Key Testing Library Concepts

### Queries

Use queries to find elements in the DOM. Prefer them in this order:

1. `getByRole` - accessible to everyone, should be your default
2. `getByLabelText` - great for form fields
3. `getByPlaceholderText` - when label isn't available
4. `getByText` - for non-interactive elements
5. `getByTestId` - escape hatch, use sparingly

### User Events

Use `@testing-library/user-event` over `fireEvent` when possible:

```tsx
import userEvent from '@testing-library/user-event';

it('handles user input', async () => {
  const user = userEvent.setup();
  render(<MyForm />);
  
  await user.type(screen.getByRole('textbox'), 'Hello');
  await user.click(screen.getByRole('button', { name: /submit/i }));
});
```

## Common Patterns

### Testing State Changes

```tsx
it('increments counter when button is clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Testing Async Operations

```tsx
it('loads and displays data', async () => {
  render(<DataLoader />);
  
  // Wait for element to appear
  expect(await screen.findByText('Data loaded')).toBeInTheDocument();
});
```

### Mocking API Calls

```tsx
// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' }),
  })
) as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});
```

### Mocking Modules

```tsx
jest.mock('./api', () => ({
  fetchTodos: jest.fn(),
}));

import { fetchTodos } from './api';

beforeEach(() => {
  (fetchTodos as jest.Mock).mockResolvedValue([
    { id: 1, text: 'Test todo', completed: false }
  ]);
});
```

## Common Mistakes to Avoid

These are based on Kent C. Dodds' article on common mistakes:

### 1. Not using screen

```tsx
// Avoid
const { getByRole } = render(<Example />);
const button = getByRole('button');

// Prefer
render(<Example />);
const button = screen.getByRole('button');
```

### 2. Using the wrong query

```tsx
// Avoid - test IDs are an escape hatch
screen.getByTestId('submit-button');

// Prefer - query by role and accessible name
screen.getByRole('button', { name: /submit/i });
```

### 3. Using queryBy for assertions

```tsx
// Avoid - less helpful error messages
expect(screen.queryByRole('alert')).toBeInTheDocument();

// Prefer - better error messages when failing
expect(screen.getByRole('alert')).toBeInTheDocument();

// Use queryBy only when checking something doesn't exist
expect(screen.queryByRole('alert')).not.toBeInTheDocument();
```

### 4. Wrapping things in act unnecessarily

`render` and `fireEvent` are already wrapped in `act`. Don't wrap them again.

### 5. Using waitFor incorrectly

```tsx
// Avoid - use findBy instead
const button = await waitFor(() => screen.getByRole('button'));

// Prefer
const button = await screen.findByRole('button');

// Avoid - empty callback
await waitFor(() => {});

// Prefer - wait for specific assertion
await waitFor(() => expect(mockFn).toHaveBeenCalled());
```