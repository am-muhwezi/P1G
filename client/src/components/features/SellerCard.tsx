import type { Seller } from '../../data/mock';

interface SellerCardProps {
  seller: Seller;
}

export function SellerCard({ seller }: SellerCardProps) {
  const stars = Math.floor(seller.rating);
  const hasHalf = seller.rating - stars >= 0.5;

  return (
    <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/20 dark:bg-surface-dim dark:border-surface-container">
      <h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-stack-sm dark:text-outline-variant">
        Verified Seller
      </h4>
      <div className="flex items-center gap-4 mb-stack-md">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
          <img className="w-full h-full object-cover" src={seller.avatar} alt={seller.name} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h3 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{seller.name}</h3>
            <span className="material-symbols-outlined text-primary text-xl dark:text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div className="flex items-center gap-1 text-tertiary">
            {Array.from({ length: stars }, (_, i) => (
              <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            ))}
            {hasHalf && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>}
            <span className="text-label-sm font-label-sm ml-1 text-on-surface-variant dark:text-outline-variant">({seller.reviewCount} Reviews)</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-stack-md">
        <div className="flex justify-between text-label-lg">
          <span className="text-on-surface-variant dark:text-outline-variant">Member Since</span>
          <span className="text-on-surface dark:text-primary-fixed font-semibold">{seller.memberSince}</span>
        </div>
        <div className="flex justify-between text-label-lg">
          <span className="text-on-surface-variant dark:text-outline-variant">Response Rate</span>
          <span className="text-on-surface dark:text-primary-fixed font-semibold">{seller.responseRate}</span>
        </div>
        <div className="flex justify-between text-label-lg">
          <span className="text-on-surface-variant dark:text-outline-variant">Verified Sales</span>
          <span className="text-on-surface dark:text-primary-fixed font-semibold">{seller.verifiedSales}</span>
        </div>
      </div>
    </div>
  );
}
