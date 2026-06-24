import { Chip } from '../ui/Chip';

interface FilterBarProps {
  filters: { id: string; label: string; icon?: string }[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export function FilterBar({ filters, activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-stack-sm overflow-x-auto pb-2 custom-scrollbar">
      {filters.map((filter) => (
        <Chip
          key={filter.id}
          active={activeFilter === filter.id}
          icon={filter.icon}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </Chip>
      ))}
    </div>
  );
}
