import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="My Card">Content</Card>);
    expect(screen.getByText('My Card')).toBeInTheDocument();
  });

  it('does not render title element when not provided', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('card-default');
  });

  it('applies the correct variant class', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    expect(container.firstChild).toHaveClass('card-elevated');
  });

  it('applies additional className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  describe('Sub-components', () => {
    it('renders Card.Header', () => {
      render(
        <Card>
          <Card.Header>Header Content</Card.Header>
        </Card>
      );
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('renders Card.Body', () => {
      render(
        <Card>
          <Card.Body>Body Content</Card.Body>
        </Card>
      );
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('renders Card.Footer', () => {
      render(
        <Card>
          <Card.Footer>Footer Content</Card.Footer>
        </Card>
      );
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });
  });
});
