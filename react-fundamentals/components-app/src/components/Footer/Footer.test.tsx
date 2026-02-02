import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders default copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} All rights reserved.`)).toBeInTheDocument();
  });

  it('renders custom copyright text', () => {
    render(<Footer copyright="© 2024 My Company" />);
    expect(screen.getByText('© 2024 My Company')).toBeInTheDocument();
  });

  it('renders footer sections', () => {
    const sections = [
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Careers', href: '/careers' },
        ],
      },
    ];
    
    render(<Footer sections={sections} />);
    
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });

  it('calls onLinkClick when a link is clicked', () => {
    const handleLinkClick = jest.fn();
    const sections = [
      {
        title: 'Links',
        links: [{ label: 'Home', href: '/' }],
      },
    ];
    
    render(<Footer sections={sections} onLinkClick={handleLinkClick} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(handleLinkClick).toHaveBeenCalledWith('/');
  });

  it('does not render sections container when no sections provided', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('.footer-sections')).not.toBeInTheDocument();
  });

  it('renders multiple sections', () => {
    const sections = [
      { title: 'Products', links: [{ label: 'App', href: '/app' }] },
      { title: 'Support', links: [{ label: 'Help', href: '/help' }] },
    ];
    
    render(<Footer sections={sections} />);
    
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });
});
