# React Fundamentals - Components & Props

This module covers the core building blocks of React: components and props. By the end, you should be comfortable creating reusable functional components and passing data between them.

## What is a React Component?

A component is a reusable piece of UI. Think of it like a function that returns HTML (actually JSX). Instead of writing one giant HTML file, you break your UI into small, manageable pieces.

```jsx
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

That's it. That's a component.

## JSX - HTML in JavaScript

JSX lets you write HTML-like syntax in JavaScript. There are a few rules to remember:

1. **Return a single root element** - Wrap multiple elements in a parent div or use fragments (`<>...</>`)
2. **Close all tags** - Even self-closing ones like `<img />` and `<br />`
3. **camelCase for attributes** - `className` instead of `class`, `onClick` instead of `onclick`
4. **Curly braces for JavaScript** - Use `{}` to embed JS expressions: `<p>{user.name}</p>`

```jsx
// Good
function Card() {
  return (
    <div className="card">
      <h2>Title</h2>
      <p>Content</p>
    </div>
  );
}

// Also good - using fragment
function Card() {
  return (
    <>
      <h2>Title</h2>
      <p>Content</p>
    </>
  );
}
```

## Props - Passing Data to Components

Props are how you pass data from a parent component to a child. They're like function arguments.

```jsx
// Parent passes data
function App() {
  return <Greeting name="Alice" />;
}

// Child receives props
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}
```

Most people destructure props for cleaner code:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Props are read-only

Never modify props inside a component. They flow down from parent to child (one-way data flow).

```jsx
// Don't do this
function BadComponent(props) {
  props.name = "Changed"; // This is wrong
  return <p>{props.name}</p>;
}
```

### Default props

You can set default values:

```jsx
function Button({ label = "Click me", onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
```

## Component Composition

Composition is about building complex UIs from simple components. There are a few patterns:

### Children prop

The `children` prop lets you nest content inside a component:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Any content can go here</p>
</Card>
```

### Specialization

Create specific versions of generic components:

```jsx
function Button({ variant = "primary", children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

function DangerButton(props) {
  return <Button variant="danger" {...props} />;
}
```

## Thinking in React - Component Hierarchy

When building a UI:

1. **Break the UI into components** - Draw boxes around each piece
2. **Arrange them in a hierarchy** - Which components contain others?
3. **Identify the data each needs** - What props should flow where?

Example for a simple page:

```
App
├── Header
│   └── Logo
│   └── Navigation
├── Main
│   ├── Card
│   └── Card
└── Footer
```

Start with the smallest components (leaves of the tree) and work your way up.

## Functional Component Best Practices

1. **Keep components small** - If it's doing too much, split it
2. **One responsibility** - A component should do one thing well
3. **Descriptive names** - `UserCard` is better than `Card1`
4. **Props interface** - In TypeScript, define your props types
5. **Avoid inline styles** - Use CSS classes or styled-components
6. **Extract repeated logic** - If you copy-paste, make a component

```tsx
// With TypeScript - define your props
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

## Building Reusable Components

A truly reusable component:

- Has clear, well-documented props
- Handles edge cases (loading, empty states, errors)
- Doesn't make assumptions about where it's used
- Uses composition (children) when flexibility is needed
- Provides sensible defaults
