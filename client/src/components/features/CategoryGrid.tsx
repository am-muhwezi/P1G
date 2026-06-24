import type { CategoryDisplay } from '../../lib/data';
import { useNavigate } from 'react-router-dom';

interface CategoryGridProps {
  categories: CategoryDisplay[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => navigate(`/market?category=${cat.id}`)}
          className="flex flex-col items-center gap-2 p-6 bg-surface-container-lowest rounded-xl border border-outline-variant/20 hover:border-primary hover:shadow-md transition-all cursor-pointer dark:bg-surface-dim dark:border-surface-container dark:hover:border-primary-fixed"
        >
          <span className="text-3xl">{cat.emoji}</span>
          <span className="font-label-lg text-label-lg text-on-surface text-center dark:text-primary-fixed">{cat.name}</span>
          <span className="font-label-sm text-label-sm text-outline dark:text-outline-variant">{cat.count} listings</span>
        </button>
      ))}
    </div>
  );
}
