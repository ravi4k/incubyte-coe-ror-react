import { useState } from 'react';
import { Button, Card, Header, Footer } from './components';
import type { NavItem, FooterSection } from './components';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('/');

  // Navigation items with active state management
  const navItems: NavItem[] = [
    { label: 'Home', href: '/', isActive: activePage === '/' },
    { label: 'Components', href: '/components', isActive: activePage === '/components' },
    { label: 'About', href: '/about', isActive: activePage === '/about' },
  ];

  // Footer sections demonstrating the component
  const footerSections: FooterSection[] = [
    {
      title: 'Learn',
      links: [
        { label: 'Footer Label 1', href: '/link1' },
        { label: 'Footer Label 2', href: '/link2' },
        { label: 'Footer Label 3', href: '/link3' },
      ],
    }
  ];

  const handleNavClick = (href: string) => {
    setActivePage(href);
    console.log(`Navigating to: ${href}`);
  };

  return (
    <div className="app">
      {/* Header Component Demo */}
      <Header
        title="React Fundamentals"
        logo={<span className="logo">⚛️</span>}
        navItems={navItems}
        onNavClick={handleNavClick}
      />

      <main className="main-content">
        {/* Introduction Section */}
        <section className="section">
          <h2>Component Showcase</h2>
          <p className="section-description">
            This app demonstrates reusable React components built with TypeScript.
          </p>
        </section>

        <section className="section">
          <h3>Button Component</h3>
          <p>Buttons with different variants and sizes:</p>

          <div className="demo-group">
            <h4>Sizes</h4>
            <div className="button-row">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>
        </section>

        {/* Card Component Demo */}
        <section className="section">
          <h3>Card Component</h3>
          <p>Cards with different variants:</p>

          <div className="card-grid">
            {/* Simple Card with title prop */}
            <Card title="Simple Card" variant="default">
              <p>This card uses the title prop for a quick header.</p>
            </Card>

            {/* Outlined Card */}
            <Card title="Outlined Card" variant="outlined">
              <p>This card has an outlined style variant.</p>
            </Card>

            {/* Elevated Card */}
          </div>

          <h4>Composition Pattern</h4>
          <p>Using Card sub-components for more control:</p>

          <Card variant="elevated">
            <Card.Header>
              <h3 style={{ margin: 0 }}>Composed Card</h3>
            </Card.Header>
            <Card.Body>
              <p>This card uses Card.Header, Card.Body, and Card.Footer sub-components.</p>
              <p>This pattern gives you full control over the card's structure.</p>
            </Card.Body>
            <Card.Footer>
              <div className="button-row">
                <Button variant="secondary" size="small">Cancel</Button>
                <Button variant="primary" size="small">Save</Button>
              </div>
            </Card.Footer>
          </Card>
        </section>
      </main>

      {/* Footer Component Demo */}
      <Footer
        sections={footerSections}
        onLinkClick={(href) => console.log(`Footer link clicked: ${href}`)}
      />
    </div>
  );
}

export default App;
