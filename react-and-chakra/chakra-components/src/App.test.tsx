import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from './context';
import App from './App';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>{ui}</ThemeProvider>
    </ChakraProvider>
  );
};

describe('App', () => {
  it('renders the main heading', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /chakra component library/i })).toBeInTheDocument();
  });

  it('renders the button showcase section', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /button variants/i })).toBeInTheDocument();
  });

  it('renders the card showcase section', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /card variants/i })).toBeInTheDocument();
  });

  it('renders the contact form section', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /contact form/i })).toBeInTheDocument();
  });

  it('renders the theme settings section', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('heading', { name: /theme settings/i })).toBeInTheDocument();
  });

  it('renders footer with documentation links', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('link', { name: /useReducer docs/i })).toHaveAttribute(
      'href',
      'https://react.dev/reference/react/useReducer'
    );
    expect(screen.getByRole('link', { name: /context docs/i })).toHaveAttribute(
      'href',
      'https://react.dev/reference/react/useContext'
    );
    expect(screen.getByRole('link', { name: /chakra ui/i })).toHaveAttribute(
      'href',
      'https://chakra-ui.com'
    );
  });
});
