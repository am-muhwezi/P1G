interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  className?: string;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed',
  secondary: 'bg-secondary text-on-secondary',
  tertiary: 'bg-tertiary-container text-white',
  outline: 'bg-surface-container-high text-on-surface-variant dark:bg-surface-container dark:text-on-surface',
};

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-label-sm shadow-sm ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
