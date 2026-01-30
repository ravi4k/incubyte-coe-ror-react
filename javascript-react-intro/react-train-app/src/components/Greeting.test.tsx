import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Greeting from './Greeting';

describe('Greeting Component', () => {
  test('renders greeting message with default name', () => {
    render(<Greeting />);
    const greetingText = screen.getByText(/Guest/i);
    expect(greetingText).toBeInTheDocument();
  });

  test('renders greeting message with provided name', () => {
    render(<Greeting name="John" />);
    const greetingText = screen.getByText(/John/i);
    expect(greetingText).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    render(<Greeting name="Alice" title="Learning React" />);
    const titleText = screen.getByText(/Learning React/i);
    expect(titleText).toBeInTheDocument();
  });

  test('renders welcome message', () => {
    render(<Greeting />);
    const welcomeText = screen.getByText(/Welcome/i);
    expect(welcomeText).toBeInTheDocument();
  });

  test('renders button text', () => {
    render(<Greeting />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test('increments counter on button click', () => {
    render(<Greeting />);
    const button = screen.getByRole('button', { name: /click me/i });
    const counterText = screen.getByText(/you've clicked the button 0 times/i);

    expect(counterText).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(/you've clicked the button 1 time$/i)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByText(/you've clicked the button 2 times/i)).toBeInTheDocument();
  });

  test('displays current time', () => {
    render(<Greeting />);
    const timeDisplay = screen.getByText(/current time:/i);
    expect(timeDisplay).toBeInTheDocument();
  });

  test('renders with correct structure', () => {
    const { container } = render(<Greeting name="Alice" />);
    const greetingDiv = container.querySelector('.greeting');
    expect(greetingDiv).toBeInTheDocument();
  });

  test('displays greeting with name', () => {
    render(<Greeting name="John" />);
    const greeting = screen.getByRole('heading', { level: 1 });
    expect(greeting).toHaveTextContent('John!');
  });
});


