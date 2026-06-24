interface ChipProps {
  active?: boolean;
  icon?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function Chip({ active = false, icon, children, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full font-label-sm text-label-sm flex items-center gap-1 cursor-pointer whitespace-nowrap transition-colors ${
        active
          ? 'bg-primary text-on-primary'
          : 'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low dark:border-outline dark:bg-surface-dim dark:text-outline-variant dark:hover:bg-surface-container'
      }`}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}
