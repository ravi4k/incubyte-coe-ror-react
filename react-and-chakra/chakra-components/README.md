# Chakra Component Library

A demo React application showcasing advanced React patterns and Chakra UI v3.

## Features

- **useReducer** for complex form state management
- **Context API** for global theme state
- **Chakra UI v3** for styling and components
- **Responsive layouts** using Chakra's responsive syntax
- **Accessible components** with proper ARIA attributes

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Button/          # Reusable button with variants
│   ├── Card/            # Compound component pattern
│   ├── ContactForm/     # Form with useReducer state
│   └── ThemeSettings/   # Theme controls
├── context/
│   └── ThemeContext.tsx # Theme state with useReducer
├── App.tsx              # Main app with responsive layout
└── index.tsx            # Entry point with providers
```

## Concepts Demonstrated

### useReducer for Complex State

The `ContactForm` component uses `useReducer` to manage:
- Form field values
- Validation errors
- Touched state for each field
- Submission status
- Success/failure states

### Context API

The `ThemeContext` provides global access to:
- Color mode (light/dark)
- Primary color selection
- Font size preference
- Helper functions to update theme

### Component Composition

The `Card` component demonstrates the compound component pattern:
```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

### Responsive Styles

Using Chakra's object syntax:
```tsx
<Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}>
```

## References

- [React useReducer](https://react.dev/reference/react/useReducer)
- [React useContext](https://react.dev/reference/react/useContext)
- [Chakra UI Documentation](https://chakra-ui.com/)
