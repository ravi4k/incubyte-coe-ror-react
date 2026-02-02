import './Footer.css';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  /** Copyright text */
  copyright?: string;
  /** Footer sections with links */
  sections?: FooterSection[];
  /** Callback when a link is clicked */
  onLinkClick?: (href: string) => void;
}

function Footer({ copyright, sections = [], onLinkClick }: FooterProps) {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onLinkClick?.(href);
  };

  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} All rights reserved.`;

  return (
    <footer className="footer">
      {sections.length > 0 && (
        <div className="footer-sections">
          {sections.map((section) => (
            <div key={section.title} className="footer-section">
              <h4 className="footer-section-title">{section.title}</h4>
              <ul className="footer-section-links">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="footer-link"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </footer>
  );
}

export default Footer;
