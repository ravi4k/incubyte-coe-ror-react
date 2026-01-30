import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the App with Greeting component', () => {
  render(<App />);
  const greetingElement = screen.getByText(/React Developer/i);
  expect(greetingElement).toBeInTheDocument();

  const titleElement = screen.getByText(/Your Learning Journey Begins Here/i);
  expect(titleElement).toBeInTheDocument();
});
