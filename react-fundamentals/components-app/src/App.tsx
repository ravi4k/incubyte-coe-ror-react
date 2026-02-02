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
        { label: 'Documentation', href: '/docs' },
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Examples', href: '/examples' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'GitHub', href: 'https://github.com' },
        { label: 'Discord', href: 'https://discord.com' },
      ],
    },
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
            Each component follows best practices: typed props, composition patterns,
            and clean separation of concerns.
          </p>
        </section>

        {/* Button Component Demo */}
        <section className="section">
          <h3>Button Component</h3>
          <p>Buttons with different variants and sizes:</p>
          
          <div className="demo-group">
            <h4>Variants</h4>
            <div className="button-row">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          <div className="demo-group">
            <h4>Sizes</h4>
            <div className="button-row">
              <Button size="small">Small</Button>
              <Button size="medium">Medium</Button>
              <Button size="large">Large</Button>
            </div>
          </div>

          <div className="demo-group">
            <h4>States</h4>
            <div className="button-row">
              <Button onClick={() => alert('Clicked!')}>Click Me</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* Card Component Demo */}
        <section className="section">
          <h3>Card Component</h3>
          <p>Cards with different variants and composition patterns:</p>

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
            <Card title="Elevated Card" variant="elevated">
              <p>This card uses a shadow for elevation.</p>
            </Card>
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

        {/* Props Demo */}
        <section className="section">
          <h3>Understanding Props</h3>
          <Card variant="outlined">
            <p>Props flow from parent to child (one-way data flow):</p>
            <ul>
              <li><strong>Button</strong> receives: variant, size, disabled, onClick, children</li>
              <li><strong>Card</strong> receives: title, variant, className, children</li>
              <li><strong>Header</strong> receives: title, logo, navItems, onNavClick</li>
              <li><strong>Footer</strong> receives: copyright, sections, onLinkClick</li>
            </ul>
            <p>
              The <code>children</code> prop is special - it represents whatever you put 
              between the opening and closing tags of a component.
            </p>
          </Card>
        </section>
      </main>

      {/* Footer Component Demo */}
      <Footer
        sections={footerSections}
        copyright="© 2024 React Fundamentals Learning App"
        onLinkClick={(href) => console.log(`Footer link clicked: ${href}`)}
      />
    </div>
  );
}

export default App;
