import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import { useWishlist } from "../store/wishlist"
import { useCart } from "../store/cart"
import { formatUGX } from "../lib/data"

export function Wishlist() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({ listingId: item.listingId, title: item.title, price: item.price, quantity: 1, sellerName: item.sellerName, unit: item.unit })
    removeItem(item.listingId)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff8f6" }}>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <Link
          to="/market"
          className="inline-flex items-center gap-2 mb-stack-md font-label-md"
          style={{ color: "#707a6c", letterSpacing: "0.05em" }}
        >
          <ArrowLeft size={18} />
          Back to Marketplace
        </Link>

        <div className="flex items-center justify-between mb-stack-lg">
          <div>
            <h1
              className="font-headline-lg"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: 700, letterSpacing: "-0.01em", color: "#2e150b" }}
            >
              My Wishlist
            </h1>
            <p className="font-body-md mt-1" style={{ color: "#40493d" }}>
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "#ffe9e3" }}>
              <Heart size={16} style={{ color: "#ba1a1a" }} fill="#ba1a1a" />
              <span className="font-label-md" style={{ color: "#2e150b" }}>{items.length}</span>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "#ffe9e3" }}>
              <Heart size={36} style={{ color: "#707a6c" }} />
            </div>
            <h2 className="font-headline-md mb-2" style={{ color: "#2e150b" }}>Your wishlist is empty</h2>
            <p className="font-body-md mb-8" style={{ color: "#707a6c" }}>
              Save items you love by tapping the heart icon
            </p>
            <Link
              to="/market"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-label-md"
              style={{ backgroundColor: "#0d631b", color: "#ffffff", letterSpacing: "0.05em" }}
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
            {items.map((item) => (
              <div
                key={item.listingId}
                className="rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md"
                style={{ backgroundColor: "#ffffff", borderRadius: "16px", boxShadow: "0 2px 20px rgba(121,85,72,0.08)" }}
              >
                <div className="relative h-40 w-full" style={{ backgroundColor: "#fff1ec" }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">🐷</span>
                  </div>
                  <button
                    onClick={() => removeItem(item.listingId)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <Trash2 size={14} style={{ color: "#ba1a1a" }} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="font-label-md mb-1" style={{ color: "#707a6c", letterSpacing: "0.05em", fontSize: "12px" }}>
                    {item.district}
                  </p>
                  <h3 className="font-headline-md mb-2 line-clamp-2" style={{ color: "#2e150b", fontSize: "16px", fontWeight: 600, lineHeight: "24px" }}>
                    {item.title}
                  </h3>
                  <p className="font-body-lg font-bold mb-4" style={{ color: "#0d631b", fontSize: "20px" }}>
                    {formatUGX(item.price)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-label-md transition-all active:scale-95"
                    style={{ backgroundColor: "#0d631b", color: "#ffffff", letterSpacing: "0.05em" }}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
