import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Chip } from '../ui/Chip';
import { Select } from '../ui/Select';
import { RangeSlider } from '../ui/RangeSlider';
import { api } from '../../lib/api';
import { CATEGORY_LABELS, CATEGORY_EMOJI, UGANDAN_DISTRICTS, PRICE_RANGES, formatUGX, type Category } from '../../lib/data';

const CATEGORY_CHIPS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  ...(Object.keys(CATEGORY_LABELS) as Category[]).map((id) => ({ id, label: CATEGORY_LABELS[id] })),
];

export function MarketplaceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [breeds, setBreeds] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(5000000);

  useEffect(() => {
    api
      .get('/api/listings/filters')
      .then((data) => {
        setBreeds(data.breeds || []);
        if (data.maxPrice > 0) setMaxPrice(data.maxPrice);
      })
      .catch(() => {});
  }, []);

  const category = searchParams.get('category') || 'all';
  const priceRange = searchParams.get('price') || 'any';
  const location = searchParams.get('location') || '';
  const breed = searchParams.get('breed') || '';
  const verified = searchParams.get('verified') === 'true';
  const customMin = Number(searchParams.get('min_price')) || 0;
  const customMax = Number(searchParams.get('max_price')) || maxPrice;

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'any') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const handlePriceRangeChange = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.delete('min_price');
    next.delete('max_price');
    if (id === 'custom') {
      next.set('price', 'custom');
      next.set('min_price', '0');
      next.set('max_price', String(maxPrice));
    } else if (id === 'all' || id === 'any') {
      next.delete('price');
    } else {
      next.set('price', id);
    }
    setSearchParams(next);
  };

  const handleCustomPriceChange = ([lo, hi]: [number, number]) => {
    const next = new URLSearchParams(searchParams);
    next.set('price', 'custom');
    next.set('min_price', String(lo));
    next.set('max_price', String(hi));
    setSearchParams(next);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') updateParam('q', searchQuery);
  };

  return (
    <div className="space-y-stack-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-gutter">
        <Input
          icon="search"
          placeholder="Search for quality livestock or produce..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="flex items-center gap-stack-sm overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORY_CHIPS.map((c) => (
          <Chip key={c.id} active={category === c.id} onClick={() => updateParam('category', c.id)}>
            {c.id !== 'all' ? `${CATEGORY_EMOJI[c.id as Category]} ` : ''}
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-stack-sm">
        <Select
          icon="payments"
          value={priceRange}
          onChange={(e) => handlePriceRangeChange(e.target.value)}
          options={PRICE_RANGES.map((r) => ({ value: r.id, label: r.label }))}
          aria-label="Filter by price"
        />
        <Select
          icon="location_on"
          value={location}
          onChange={(e) => updateParam('location', e.target.value)}
          options={[{ value: '', label: 'All Locations' }, ...UGANDAN_DISTRICTS.map((d) => ({ value: d, label: d }))]}
          aria-label="Filter by location"
        />
        <Select
          icon="pets"
          value={breed}
          onChange={(e) => updateParam('breed', e.target.value)}
          options={[{ value: '', label: 'All Breeds' }, ...breeds.map((b) => ({ value: b, label: b }))]}
          aria-label="Filter by breed"
        />
        <Chip icon="verified" active={verified} onClick={() => updateParam('verified', verified ? null : 'true')}>
          Verified Only
        </Chip>
      </div>

      {priceRange === 'custom' && (
        <div className="max-w-sm bg-surface-container-lowest dark:bg-surface-dim rounded-xl px-4 py-2 border border-outline-variant dark:border-outline">
          <RangeSlider
            min={0}
            max={maxPrice}
            value={[Math.min(customMin, customMax), Math.max(customMin, customMax)]}
            onChange={handleCustomPriceChange}
            formatValue={formatUGX}
          />
        </div>
      )}
    </div>
  );
}
