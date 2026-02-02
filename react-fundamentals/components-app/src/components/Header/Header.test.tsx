import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the title', () => {
    render(<Header title="My App" />);
    expect(screen.getByText('My App')).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    render(<Header title="My App" logo={<span data-testid="logo">Logo</span>} />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders navigation items', () => {
    const navItems = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ];
    
    render(<Header title="My App" navItems={navItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('applies active class to active nav item', () => {
    const navItems = [
      { label: 'Home', href: '/', isActive: true },
      { label: 'About', href: '/about' },
    ];
    
    render(<Header title="My App" navItems={navItems} />);
    
    const homeLink = screen.getByText('Home');
    const aboutLink = screen.getByText('About');
    
    expect(homeLink).toHaveClass('active');
    expect(aboutLink).not.toHaveClass('active');
  });

  it('calls onNavClick when nav item is clicked', () => {
    const handleNavClick = jest.fn();
    const navItems = [{ label: 'Home', href: '/' }];
    
    render(<Header title="My App" navItems={navItems} onNavClick={handleNavClick} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(handleNavClick).toHaveBeenCalledWith('/');
  });

  it('does not render nav when navItems is empty', () => {
    render(<Header title="My App" />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
