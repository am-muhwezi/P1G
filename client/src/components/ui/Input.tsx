import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative flex-grow">
      {icon && (
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant">
          {icon}
        </span>
      )}
      <input
        className={`w-full pl-12 pr-4 py-4 bg-warm-beige border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md font-body-md placeholder-outline-variant shadow-sm transition-all dark:bg-surface-dim dark:text-primary-fixed dark:placeholder:text-outline ${className}`}
        {...props}
      />
    </div>
  );
}
