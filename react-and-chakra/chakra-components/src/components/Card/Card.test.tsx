import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from '../../context';
import { Card } from './Card';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>{ui}</ThemeProvider>
    </ChakraProvider>
  );
};

describe('Card', () => {
  it('renders children correctly', () => {
    renderWithProviders(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with header, body and footer', () => {
    renderWithProviders(
      <Card>
        <Card.Header>
          <h2>Title</h2>
        </Card.Header>
        <Card.Body>
          <p>Body content</p>
        </Card.Body>
        <Card.Footer>
          <button>Action</button>
        </Card.Footer>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    renderWithProviders(
      <Card>
        <Card.Image src="test.jpg" alt="Test image" />
        <Card.Body>Content</Card.Body>
      </Card>
    );

    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });
});
