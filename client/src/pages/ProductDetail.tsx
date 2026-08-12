import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { formatUGX, formatDate, type Listing } from '../lib/data';
import { Button } from '../components/ui/Button';
import { useCart } from '../store/cart';
import { useToast } from '../store/toast';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCart((s) => s.addItem);
  const toast = useToast((s) => s.toast);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setActiveImage(0)
    api.get(`/api/listings/${id}`).then(setListing).catch(() => setListing(null)).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
        <p className="text-on-surface-variant font-body-lg text-center py-20 dark:text-outline-variant">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
        <p className="text-on-surface-variant font-body-lg text-center py-20 dark:text-outline-variant">Listing not found.</p>
      </div>
    );
  }

  const galleryImages = listing.images?.length
    ? listing.images
    : listing.image
      ? [listing.image]
      : []
  const activeSrc = galleryImages[activeImage] || listing.image || 'https://placehold.co/800x600/e8fff0/0d631b?text=No+Image'

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
      <nav className="mb-stack-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors dark:text-outline-variant dark:hover:text-primary-fixed"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label-lg text-label-lg">Back to Market</span>
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7 space-y-stack-md">
          <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl shadow-md border border-outline-variant/30">
            <img
              className="w-full h-full object-cover"
              src={activeSrc}
              alt={listing.title}
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImage
                      ? "border-primary dark:border-primary-fixed"
                      : "border-transparent hover:border-outline-variant"
                  }`}
                >
                  <img className="w-full h-full object-cover" src={src} alt={`${listing.title} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/20 dark:bg-surface-dim dark:border-surface-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-sm">
              <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">{listing.title}</h1>
              <div className="flex items-center gap-2 text-primary dark:text-primary-fixed font-bold">
                <span className="font-headline-md text-headline-md">{formatUGX(listing.price)}</span>
              </div>
            </div>
            <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed mb-stack-md dark:text-outline-variant">
              {listing.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full border border-outline-variant/50 dark:bg-surface dark:border-surface-container">
                <span className="material-symbols-outlined text-sm text-outline dark:text-outline-variant">inventory_2</span>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{listing.stock} {listing.unit}(s) available</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full border border-outline-variant/50 dark:bg-surface dark:border-surface-container">
                <span className="material-symbols-outlined text-sm text-outline dark:text-outline-variant">location_on</span>
                <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">{listing.district}</span>
              </div>
              {listing.sellerVerified && (
                <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full border border-outline-variant/50 dark:bg-surface dark:border-surface-container">
                  <span className="material-symbols-outlined text-sm text-primary dark:text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Verified Seller</span>
                </div>
              )}
            </div>
          </div>

          {(listing.sex || listing.breed || listing.ageMonths || listing.ageWeeks) && (
            <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/20 dark:bg-surface-dim dark:border-surface-container">
              <h2 className="font-headline-sm text-headline-sm text-on-surface dark:text-primary-fixed mb-stack-sm">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {listing.breed && (
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-on-surface-variant dark:text-outline-variant font-label-sm text-label-sm">Breed</span>
                    <span className="text-on-surface dark:text-primary-fixed font-label-sm text-label-sm">{listing.breed}</span>
                  </div>
                )}
                {listing.sex && (
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-on-surface-variant dark:text-outline-variant font-label-sm text-label-sm">Sex</span>
                    <span className="text-on-surface dark:text-primary-fixed font-label-sm text-label-sm">{listing.sex}</span>
                  </div>
                )}
                {(listing.ageMonths ?? 0) > 0 && (
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-on-surface-variant dark:text-outline-variant font-label-sm text-label-sm">Age</span>
                    <span className="text-on-surface dark:text-primary-fixed font-label-sm text-label-sm">{listing.ageMonths} month{listing.ageMonths === 1 ? "" : "s"}</span>
                  </div>
                )}
                {(listing.ageWeeks ?? 0) > 0 && (
                  <div className="flex justify-between py-2 border-b border-outline-variant/20 dark:border-surface-container">
                    <span className="text-on-surface-variant dark:text-outline-variant font-label-sm text-label-sm">Age</span>
                    <span className="text-on-surface dark:text-primary-fixed font-label-sm text-label-sm">{listing.ageWeeks} week{listing.ageWeeks === 1 ? "" : "s"}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-stack-md">
          <div className="sticky top-24 space-y-stack-md">
            <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/20 dark:bg-surface-dim dark:border-surface-container">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-lg dark:bg-primary dark:text-on-primary">
                  {listing.sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{listing.sellerName}</h3>
                    {listing.sellerVerified && (
                      <span className="material-symbols-outlined text-primary text-lg dark:text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    )}
                  </div>
                  <p className="text-label-sm text-on-surface-variant dark:text-outline-variant">{listing.district} based seller</p>
                </div>
              </div>
              <div className="space-y-2 text-label-lg">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant dark:text-outline-variant">Listed</span>
                  <span className="text-on-surface dark:text-primary-fixed">{formatDate(listing.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant dark:text-outline-variant">Views</span>
                  <span className="text-on-surface dark:text-primary-fixed">{listing.views}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                disabled={listing.stock <= 0}
                onClick={() => {
                  if (listing.stock <= 0) { toast("This item is out of stock", "error"); return }
                  addItem({ listingId: listing.id, title: listing.title, price: listing.price, quantity: 1, sellerName: listing.sellerName, unit: listing.unit, stock: listing.stock })
                  navigate('/cart')
                }}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                Buy Now
              </Button>
              <Button variant="secondary" className="w-full">
                <span className="material-symbols-outlined">chat_bubble</span>
                Message Seller
              </Button>
            </div>

            <div className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant/30 dark:bg-surface-dim dark:border-surface-container">
              <h4 className="font-label-lg text-label-lg mb-3 flex items-center gap-2 text-on-surface dark:text-primary-fixed">
                <span className="material-symbols-outlined text-secondary dark:text-secondary-fixed">local_shipping</span>
                Delivery Information
              </h4>
              <p className="text-label-lg text-on-surface-variant dark:text-outline-variant">
                Ships from {listing.district}. Secure payment processing ensures your funds are safe until delivery is confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
