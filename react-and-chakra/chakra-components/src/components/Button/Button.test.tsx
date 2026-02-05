import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from '../../context';
import { Button } from './Button';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>{ui}</ThemeProvider>
    </ChakraProvider>
  );
};

describe('Button', () => {
  it('renders children correctly', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    renderWithProviders(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    renderWithProviders(<Button isLoading>Submit</Button>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    renderWithProviders(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders different variants', () => {
    const { rerender } = renderWithProviders(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider>
          <Button variant="danger">Danger</Button>
        </ThemeProvider>
      </ChakraProvider>
    );
    expect(screen.getByRole('button', { name: /danger/i })).toBeInTheDocument();
  });
});
