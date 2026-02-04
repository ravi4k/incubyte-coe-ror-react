# Todo App - TDD Practice

A fully functional Todo application built using strict Test-Driven Development (TDD).

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Filter by All/Active/Completed
- Persist to localStorage
- Display active item count

## Getting Started

```bash
npm install
npm start
```

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false
```

## Project Structure

```
src/
├── components/
│   ├── TodoItem/       # Single todo item display
│   ├── TodoList/       # List of todo items
│   ├── TodoForm/       # Form to add new todos
│   └── TodoFilter/     # Filter buttons
├── hooks/
│   └── useLocalStorage.ts  # Custom hook for persistence
├── types/
│   └── index.ts        # TypeScript interfaces
├── App.tsx             # Main application component
└── App.test.tsx        # Integration tests
```

## TDD Workflow Used

Each component was built following this cycle:

1. **Red**: Write a failing test for desired behavior
2. **Green**: Write minimum code to pass the test
3. **Refactor**: Clean up while keeping tests green

Example from TodoItem:

```tsx
// Step 1: RED - Write failing test
it('renders todo text', () => {
  render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
  expect(screen.getByText('Learn TDD')).toBeInTheDocument();
});

// Step 2: GREEN - Make it pass
export const TodoItem = ({ todo }) => {
  return <span>{todo.text}</span>;
};

// Step 3: REFACTOR - Add styling, improve structure
```

## Test Coverage

The project maintains 70%+ test coverage. Current coverage:

- Statements: 91%+
- Branches: 100%
- Functions: 100%
- Lines: 91%+

## Key Testing Patterns

### Using screen queries
```tsx
render(<MyComponent />);
const button = screen.getByRole('button', { name: /submit/i });
```

### User events for interactions
```tsx
const user = userEvent.setup();
await user.type(input, 'New todo');
await user.click(button);
```

### Mocking localStorage
```tsx
beforeEach(() => {
  (localStorage.getItem as jest.Mock).mockReturnValue(null);
});
```

### Testing async behavior
```tsx
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## Learning Exercises

Try extending this app with TDD:

1. Add a "Clear completed" button
2. Add double-click to edit todos
3. Add drag-and-drop reordering
4. Add due dates to todos

For each feature, write the test first!
