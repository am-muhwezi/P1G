import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary/90 shadow-lg dark:bg-primary-fixed dark:text-on-primary-fixed dark:hover:bg-primary-fixed-dim',
  secondary:
    'border-2 border-primary text-primary hover:bg-primary/5 dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-primary-fixed/10',
  tertiary:
    'text-on-surface hover:opacity-80 dark:text-primary-fixed',
  ghost:
    'border border-primary text-primary hover:bg-primary hover:text-white dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-primary-fixed dark:hover:text-on-primary-fixed',
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-label-lg text-label-lg px-6 py-4 transition-all active:scale-95 duration-150 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
