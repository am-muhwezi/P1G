import { type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  icon?: string;
  options: SelectOption[];
}

export function Select({ icon, options, className = '', ...props }: SelectProps) {
  return (
    <div className="relative shrink-0">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline dark:text-outline-variant pointer-events-none">
          {icon}
        </span>
      )}
      <select
        className={`appearance-none bg-warm-beige border-none rounded-full cursor-pointer focus:ring-2 focus:ring-primary text-label-sm font-label-sm shadow-sm transition-all py-2 pr-9 whitespace-nowrap dark:bg-surface-dim dark:text-primary-fixed ${
          icon ? 'pl-9' : 'pl-4'
        } ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-outline dark:text-outline-variant pointer-events-none">
        expand_more
      </span>
    </div>
  );
}
