interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-high dark:bg-surface-dim dark:border-surface-container ${
        hover ? 'premium-card-shadow' : 'shadow-sm'
      } ${className}`}
    >
      {children}
    </div>
  );
}
