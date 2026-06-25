import type { Listing } from '../../lib/data';
import { CATEGORY_EMOJI, CATEGORY_LABELS, formatUGX } from '../../lib/data';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  listing: Listing;
  onAddToCart?: (listing: Listing) => void;
  plusOverlay?: boolean;
}

export function ProductCard({ listing, onAddToCart, plusOverlay }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 group cursor-pointer hover:shadow-md transition-all dark:bg-surface-dim dark:border-surface-container"
      onClick={() => navigate(`/product/${listing.id}`)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={listing.image || 'https://placehold.co/600x400/e8fff0/0d631b?text=No+Image'}
          alt={listing.title}
        />

        {plusOverlay && onAddToCart && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(listing) }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all dark:bg-primary-fixed dark:text-on-primary-fixed"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label-sm text-label-sm text-outline dark:text-outline-variant">
            {CATEGORY_EMOJI[listing.category]} {CATEGORY_LABELS[listing.category]}
          </span>
          {listing.sellerVerified && (
            <span className="font-label-sm text-label-sm text-primary dark:text-primary-fixed flex items-center gap-0.5">
              ✓ Verified
            </span>
          )}
        </div>
        <h3 className="font-headline-md text-headline-md text-on-surface mb-1 dark:text-primary-fixed">{listing.title}</h3>
        <div className="flex items-center gap-1 text-outline dark:text-outline-variant mb-3">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          <span className="font-label-sm text-label-sm">{listing.district}, Uganda</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">{formatUGX(listing.price)}</span>
          {listing.rating > 0 && (
            <span className="font-label-sm text-label-sm text-outline dark:text-outline-variant flex items-center gap-1">
              <span className="text-amber-500">★</span> {listing.rating} ({listing.reviewCount})
            </span>
          )}
        </div>
      </div>
      {onAddToCart && !plusOverlay && (
        <div className="px-4 pb-4">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(listing) }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-on-primary rounded-xl font-label-sm text-label-sm hover:bg-primary/90 transition-colors dark:bg-primary-fixed dark:text-on-primary-fixed"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
