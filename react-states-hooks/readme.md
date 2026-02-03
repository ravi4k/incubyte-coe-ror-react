# React State & Hooks

This module covers how React handles dynamic data and side effects.

## useState - Managing State

State is data that changes over time. Unlike props (which come from a parent), state is managed inside the component itself.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

The `useState` hook returns an array with two items:
1. The current state value
2. A function to update that value

### Updating State

Never modify state directly. Always use the setter function.

```jsx
// Wrong - mutating state directly
count = count + 1;

// Correct - using setter
setCount(count + 1);
```

When the new state depends on the previous state, use the functional form:

```jsx
// Preferred when updating based on previous value
setCount(prevCount => prevCount + 1);
```

This matters because state updates may be batched and asynchronous.

### State with Objects and Arrays

When working with objects or arrays, you need to create new references:

```jsx
function UserForm() {
  const [user, setUser] = useState({ name: '', email: '' });

  const updateName = (name) => {
    // Create a new object, don't mutate
    setUser({ ...user, name: name });
  };

  return (
    <input 
      value={user.name} 
      onChange={(e) => updateName(e.target.value)} 
    />
  );
}
```

For arrays:

```jsx
const [items, setItems] = useState([]);

// Adding an item
setItems([...items, newItem]);

// Removing an item
setItems(items.filter(item => item.id !== idToRemove));

// Updating an item
setItems(items.map(item => 
  item.id === idToUpdate ? { ...item, name: 'Updated' } : item
));
```

## useEffect - Handling Side Effects

Side effects are anything that interacts with the outside world: API calls, timers, DOM manipulation, subscriptions.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

### The Dependency Array

The second argument to useEffect controls when the effect runs:

```jsx
// Runs after every render
useEffect(() => {
  console.log('Render happened');
});

// Runs once on mount
useEffect(() => {
  console.log('Component mounted');
}, []);

// Runs when userId changes
useEffect(() => {
  console.log('userId changed');
}, [userId]);
```

### Cleanup Function

If your effect creates something that needs cleanup (subscriptions, timers, event listeners), return a cleanup function:

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup when component unmounts or before re-running effect
  return () => clearInterval(timer);
}, []);
```

## Event Handling

### Passing Arguments to Event Handlers

```jsx
function ItemList({ items, onDelete }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Preventing Default Behavior

```jsx
function Form({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    onSubmit();
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Conditional Rendering

There are several ways to conditionally render content:

### If statements

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in</h1>;
}
```

### Ternary operator

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <h1>{isLoggedIn ? 'Welcome back!' : 'Please sign in'}</h1>
  );
}
```

### Logical AND (short-circuit)

```jsx
function Notification({ message }) {
  return (
    <div>
      {message && <p className="notification">{message}</p>}
    </div>
  );
}
```

Be careful with falsy values like 0:

```jsx
// Bug: renders "0" when count is 0
{count && <span>Count: {count}</span>}

// Fix: be explicit
{count > 0 && <span>Count: {count}</span>}
```

## Rendering Lists

Use `map()` to render arrays. Every item needs a unique `key` prop.

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

### Keys

Keys help React identify which items changed, were added, or removed.

- Use stable, unique IDs from your data
- Don't use array index as key if the list can reorder
- Keys must be unique among siblings (not globally)

```jsx
// Good - using unique id
{items.map(item => <Item key={item.id} {...item} />)}

// Bad - using index (causes issues with reordering)
{items.map((item, index) => <Item key={index} {...item} />)}
```

## Form Handling

React forms typically use "controlled components" where React state drives the input values.

### Controlled Inputs

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Form with Multiple Fields

For forms with many fields, consider using an object:

```jsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <input name="password" value={formData.password} onChange={handleChange} />
    </form>
  );
}
```

### Form Validation

Basic validation pattern:

```jsx
function ContactForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Submit form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Rules of Hooks

Hooks have two rules you must follow:

### 1. Only call hooks at the top level

Don't call hooks inside loops, conditions, or nested functions.

```jsx
// Wrong
function Component({ isActive }) {
  if (isActive) {
    const [count, setCount] = useState(0); // Don't do this
  }
}

// Correct
function Component({ isActive }) {
  const [count, setCount] = useState(0); // Always at top level
  
  if (isActive) {
    // Use count here
  }
}
```

React relies on the order of hook calls to track state. Conditional hooks would break this.

### 2. Only call hooks from React functions

Call hooks from:
- React function components
- Custom hooks (functions starting with "use")

```jsx
// Wrong - regular function
function calculateTotal(items) {
  const [total, setTotal] = useState(0); // Don't do this
}

// Correct - custom hook
function useTotal(items) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);
  
  return total;
}
```

## Custom Hooks

Extract reusable logic into custom hooks. They must start with "use".

```jsx
// Custom hook for form input
function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return { value, onChange: handleChange, reset };
}

// Usage
function Form() {
  const name = useInput('');
  const email = useInput('');

  return (
    <form>
      <input {...name} placeholder="Name" />
      <input {...email} placeholder="Email" />
      <button type="button" onClick={() => { name.reset(); email.reset(); }}>
        Reset
      </button>
    </form>
  );
}
```

## Common Patterns

### Loading and Error States

```jsx
function UserData({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <div>{data.name}</div>;
}
```

### Debouncing Input

```jsx
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetch(`/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
```