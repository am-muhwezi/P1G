import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FilterBar } from '../components/features/FilterBar';
import { ProductCard } from '../components/features/ProductCard';
import { Input } from '../components/ui/Input';
import { MOCK_LISTINGS, marketplaceFilters } from '../lib/data';
import { useCart } from '../store/cart';
import { useWishlist } from '../store/wishlist';
import { ShoppingCart, Heart } from 'lucide-react';

export function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const { addItem, items } = useCart();
  const { addItem: addWishlist, removeItem: removeWishlist, isWishlisted } = useWishlist();
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const filtered = MOCK_LISTINGS.filter((l) => {
    if (activeFilter !== 'all') {
      if (activeFilter === 'verified') return l.sellerVerified;
      if (activeFilter === 'price') return true;
      if (activeFilter === 'location') return l.district.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (searchQuery) return l.title.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  const handleAddToCart = (listing: typeof MOCK_LISTINGS[0]) => {
    addItem({ listingId: listing.id, title: listing.title, price: listing.price, quantity: 1, sellerName: listing.sellerName, unit: listing.unit });
  };

  const handleToggleWishlist = (listing: typeof MOCK_LISTINGS[0]) => {
    if (isWishlisted(listing.id)) {
      removeWishlist(listing.id);
    } else {
      addWishlist({ listingId: listing.id, title: listing.title, price: listing.price, sellerName: listing.sellerName, unit: listing.unit, district: listing.district, image: listing.image });
    }
  };

  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
    if (id === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: id });
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchParams({ q: searchQuery });
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-stack-lg pb-24">
      <section className="mb-stack-lg space-y-stack-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-gutter">
          <Input
            icon="search"
            placeholder="Search for quality livestock or produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button className="hidden md:flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-label-lg text-label-lg shadow-lg hover:opacity-90 transition-all active:scale-95 dark:bg-primary-fixed dark:text-on-primary-fixed">
            <span className="material-symbols-outlined">tune</span>
            Advanced Filters
          </button>
        </div>
        <FilterBar
          filters={marketplaceFilters}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </section>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline-variant dark:text-outline">search_off</span>
          <p className="text-on-surface-variant font-body-lg text-body-lg mt-4 dark:text-outline-variant">No listings match your criteria.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filtered.map((listing) => (
            <ProductCard
              key={listing.id}
              listing={listing}
              onAddToCart={handleAddToCart}
              plusOverlay
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={isWishlisted(listing.id)}
            />
          ))}
        </section>
      )}

      <section className="mt-stack-lg p-gutter bg-surface-container rounded-2xl flex flex-col md:flex-row items-center justify-between gap-gutter border border-surface-container-high dark:bg-surface-dim dark:border-surface-container">
        <div className="space-y-2 max-w-2xl">
          <h2 className="font-headline-lg text-headline-lg text-primary flex items-center gap-2 dark:text-primary-fixed">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            Trade with Confidence
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant dark:text-outline-variant">
            Every transaction on P1G Kataale is backed by verified sellers and secure payment processing. Quality guaranteed.
          </p>
        </div>
        <button className="px-8 py-4 bg-white border border-primary text-primary font-label-lg text-label-lg rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm dark:bg-surface-dim dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-primary-fixed dark:hover:text-on-primary-fixed">
          Learn More
        </button>
      </section>

      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 flex flex-col gap-3 z-40">
        <button
          onClick={() => navigate('/wishlist')}
          className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          style={{ backgroundColor: "#fff8f6" }}
        >
          <Heart size={22} style={{ color: "#ba1a1a" }} fill="#ba1a1a" />
        </button>
        <button
          onClick={() => navigate('/cart')}
          className="h-14 w-14 md:h-16 md:w-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all dark:bg-primary-fixed dark:text-on-primary-fixed"
        >
          <ShoppingCart size={24} />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
