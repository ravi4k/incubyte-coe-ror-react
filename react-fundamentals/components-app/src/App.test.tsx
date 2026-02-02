import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the header with title', () => {
    render(<App />);
    expect(screen.getByText('React Fundamentals')).toBeInTheDocument();
  });

  it('renders the component showcase heading', () => {
    render(<App />);
    expect(screen.getByText('Component Showcase')).toBeInTheDocument();
  });

  it('renders Button component demo section', () => {
    render(<App />);
    expect(screen.getByText('Button Component')).toBeInTheDocument();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('renders Card component demo section', () => {
    render(<App />);
    expect(screen.getByText('Card Component')).toBeInTheDocument();
    expect(screen.getByText('Simple Card')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    render(<App />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders footer with copyright', () => {
    render(<App />);
    expect(screen.getByText('© 2024 React Fundamentals Learning App')).toBeInTheDocument();
  });
});
