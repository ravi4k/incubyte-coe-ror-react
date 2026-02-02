import './Header.css';

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface HeaderProps {
  /** Site or app title */
  title: string;
  /** Optional logo element */
  logo?: React.ReactNode;
  /** Navigation items */
  navItems?: NavItem[];
  /** Callback when nav item is clicked */
  onNavClick?: (href: string) => void;
}

function Header({ title, logo, navItems = [], onNavClick }: HeaderProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavClick?.(href);
  };

  return (
    <header className="header">
      <div className="header-brand">
        {logo && <div className="header-logo">{logo}</div>}
        <h1 className="header-title">{title}</h1>
      </div>
      
      {navItems.length > 0 && (
        <nav className="header-nav">
          <ul className="header-nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="header-nav-item">
                <a
                  href={item.href}
                  className={`header-nav-link ${item.isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
