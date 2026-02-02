import './Card.css';

export interface CardProps {
  /** Card content - uses composition pattern */
  children: React.ReactNode;
  /** Optional title displayed at top of card */
  title?: string;
  /** Visual variant of the card */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Additional CSS class names */
  className?: string;
}

function Card({
  children,
  title,
  variant = 'default',
  className = '',
}: CardProps) {
  const cardClassName = `card card-${variant} ${className}`.trim();

  return (
    <div className={cardClassName}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
}

// Sub-components for flexible composition
export interface CardHeaderProps {
  children: React.ReactNode;
}

function CardHeader({ children }: CardHeaderProps) {
  return <div className="card-header">{children}</div>;
}

export interface CardBodyProps {
  children: React.ReactNode;
}

function CardBody({ children }: CardBodyProps) {
  return <div className="card-body">{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
}

function CardFooter({ children }: CardFooterProps) {
  return <div className="card-footer">{children}</div>;
}

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
