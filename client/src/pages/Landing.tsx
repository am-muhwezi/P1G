import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_LISTINGS, CATEGORY_ICONS, CATEGORY_LABELS, formatUGX, type Category } from "@/lib/data"
import { Star, MapPin, CheckCircle, ShieldCheck, Truck, ArrowRight } from "lucide-react"

const CATEGORIES: Category[] = ["live_pigs", "semen", "feed", "medicines", "vets", "pork"]

const CATEGORY_COUNTS: Record<Category, number> = {
  live_pigs: 234, semen: 89, feed: 312, medicines: 178, vets: 67, pork: 145,
}

export default function Landing() {
  const featured = MOCK_LISTINGS.filter(l => l.status === "active").slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#1A3F1A] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">🐷</div>
            <span className="font-bold text-white text-lg">P1G Market</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/80 text-sm">
            <a href="#categories" className="hover:text-white transition-colors">Marketplace</a>
            <a href="#how" className="hover:text-white transition-colors">How It Works</a>
            <a href="#featured" className="hover:text-white transition-colors">Listings</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 text-sm h-9">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white text-sm h-9 rounded-xl">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A3F1A] via-[#2D6A2D] to-[#3d8c3d] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-xs px-3 py-1">🇺🇬 Uganda's Premier Piggery Platform</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Uganda's #1 Piggery<br />Marketplace
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Buy & Sell Pigs, Feed, Breeding Semen, Medicines & Vet Services — All in One Place. Nationwide delivery across Uganda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/signup">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-12 px-8 text-base font-semibold w-full sm:w-auto">
                Browse Marketplace <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 rounded-xl h-12 px-8 text-base w-full sm:w-auto">
                Become a Seller
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-green-300" />2,400+ Verified Farmers</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-green-300" />150+ Trusted Sellers</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={16} className="text-green-300" />Nationwide Delivery</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-14 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Browse by Category</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Find exactly what your farm needs</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <Link key={cat} to="/login" className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                <div className="text-3xl mb-2">{CATEGORY_ICONS[cat]}</div>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-green-700 mb-1">{CATEGORY_LABELS[cat]}</div>
                <div className="text-xs text-gray-400">{CATEGORY_COUNTS[cat]} listings</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section id="featured" className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked from verified sellers</p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="rounded-xl text-sm border-green-200 text-green-700 hover:bg-green-50">
                View All <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map(listing => (
              <Link key={listing.id} to="/login" className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="h-36 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center relative">
                  <span className="text-5xl">{CATEGORY_ICONS[listing.category]}</span>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 text-green-700 border-0 text-xs">{CATEGORY_LABELS[listing.category]}</Badge>
                  </div>
                  {listing.sellerVerified && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600 text-white border-0 text-xs">✓ Verified</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-green-700 transition-colors">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                    <MapPin size={11} />{listing.district}, Uganda
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-700 text-base">{formatUGX(listing.price)}</span>
                    {listing.reviewCount > 0 && (
                      <span className="flex items-center gap-0.5 text-xs text-gray-500">
                        <Star size={11} className="fill-amber-400 text-amber-400" />{listing.rating} ({listing.reviewCount})
                      </span>
                    )}
                  </div>
                  <Button className="w-full mt-3 bg-green-700 hover:bg-green-800 text-white rounded-xl h-8 text-xs">View Listing</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How P1G Market Works</h2>
          <p className="text-gray-500 text-sm mb-10">Getting started is easy</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "👤", step: "1", title: "Create Your Account", desc: "Sign up as a buyer or seller. Sellers are verified by our admin team within 24 hours." },
              { icon: "🛒", step: "2", title: "Browse & Order", desc: "Search for pigs, feed, medicines and more. Add to cart and pay via MTN/Airtel Mobile Money." },
              { icon: "🚚", step: "3", title: "Track Your Delivery", desc: "Real-time order status updates. Get your products delivered anywhere in Uganda." },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="inline-block bg-green-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full mb-3">Step {s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 px-4 bg-[#1A3F1A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to transform your piggery business?</h2>
          <p className="text-white/70 mb-6 text-sm">Join over 3,000 farmers and sellers already using P1G Market</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup"><Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl h-11 px-8">Create Free Account</Button></Link>
            <Link to="/login"><Button variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl h-11 px-8">Sign In</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111c11] text-white/60 py-8 px-4 text-sm text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-sm">🐷</div>
          <span className="font-bold text-white text-base">P1G Market</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-3 text-xs">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Contact Us</a>
        </div>
        <p className="flex items-center justify-center gap-3 text-xs">
          <ShieldCheck size={14} className="text-green-400" /> Secured & verified platform
          <Truck size={14} className="text-green-400" /> Nationwide Uganda delivery
        </p>
        <p className="mt-3 text-xs">© 2025 P1G Market Uganda. All rights reserved.</p>
      </footer>
    </div>
  )
}
