# Advanced React & Styling with Chakra UI

This module covers advanced React patterns and modern UI development with Chakra UI.

## useReducer for Complex State

When state logic gets complicated (multiple related values, complex transitions), `useState` becomes hard to manage. That's when `useReducer` shines.

### Basic Pattern

```tsx
import { useReducer } from 'react';

// Define your state shape
interface State {
  count: number;
  error: string | null;
}

// Define action types
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'setError'; payload: string };

// Reducer function - pure, predictable
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, error: null };
    case 'decrement':
      return { ...state, count: state.count - 1, error: null };
    case 'reset':
      return { count: 0, error: null };
    case 'setError':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### When to Use useReducer

- State has multiple sub-values that update together
- Next state depends on previous state
- You need predictable state transitions
- State logic is complex enough to warrant separation

## Context API Basics

Context lets you pass data through the component tree without prop drilling.

### Creating Context

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the context shape
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Create context with undefined default (we'll provide real value via Provider)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Provider component
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### When to Use Context

- Theming (dark/light mode)
- Current user/authentication state
- Locale/language preferences
- UI state that many components need

Don't overuse it. If only a few components need the data, prop drilling might be clearer.

## Introduction to Chakra UI v3

Chakra UI is a component library that makes building accessible, responsive React apps easier. It provides:

- Pre-built accessible components
- A design system with consistent spacing, colors, typography
- Style props for inline styling without CSS files
- Built-in dark mode support
- Responsive styles out of the box

### Installation

```bash
npm install @chakra-ui/react @emotion/react
```

### Setup

Wrap your app with the ChakraProvider:

```tsx
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <YourApp />
    </ChakraProvider>
  );
}
```

## Styling with Chakra Components

Chakra components accept style props directly. No CSS files needed for most styling.

### Basic Example

```tsx
import { Box, Text, Button } from '@chakra-ui/react';

function Example() {
  return (
    <Box bg="blue.500" p={4} borderRadius="md">
      <Text color="white" fontSize="lg" fontWeight="bold">
        Hello Chakra
      </Text>
      <Button colorPalette="teal" size="sm" mt={2}>
        Click me
      </Button>
    </Box>
  );
}
```

## Responsive Styles

Chakra makes responsive design simple with array or object syntax.

### Array Syntax

Values map to breakpoints in order: `[base, sm, md, lg, xl]`

```tsx
<Box
  w={['100%', '100%', '50%', '33%']}
  fontSize={['sm', 'md', 'lg']}
>
  Responsive box
</Box>
```

### Breakpoints

Default breakpoints:
- `base`: 0px
- `sm`: 480px
- `md`: 768px
- `lg`: 992px
- `xl`: 1280px

## Key Chakra Components

### Layout

- `Box` - basic div with style props
- `Flex` - flexbox container
- `Grid` - CSS grid container  
- `Stack`, `HStack`, `VStack` - stack elements with spacing
- `Container` - centered, max-width container

### Typography

- `Heading` - h1-h6 elements
- `Text` - paragraph text

### Forms

- `Input` - text input
- `Button` - button element
- `Field` - form field with label and validation
- `Checkbox`, `Radio` - selection inputs
- `Select` - dropdown select

### Feedback

- `Spinner` - loading indicator
- `Alert` - alert messages
- `Toaster` - toast notifications

### Overlay

- `Dialog` - modal dialogs
- `Drawer` - slide-in panels
