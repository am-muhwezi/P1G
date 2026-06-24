import { Hero } from '../components/features/Hero';
import { useNavigate } from 'react-router-dom';

const services = [
  { icon: "🐷", title: "Live Pigs", desc: "Breeding stock, piglets, and weaners from verified breeders across Uganda." },
  { icon: "🧬", title: "Breeding Semen", desc: "Premium genetics from top-quality Duroc, Landrace, and Large White boars." },
  { icon: "🌾", title: "Pig Feed", desc: "Maize blends, grower rations, and nutritional supplements for all stages." },
  { icon: "💊", title: "Medicines", desc: "Vaccines, dewormers, antibiotics, and farm health supplies." },
  { icon: "🩺", title: "Vet Services", desc: "Book veterinary consultations, farm visits, and herd health management." },
  { icon: "🥩", title: "Pork Products", desc: "Fresh and processed pork cuts from quality-raised pigs." },
]

const features = [
  { icon: "⏱️", title: "Save Time", desc: "Find everything for your piggery in one unified marketplace. Focus on farming, not sourcing." },
  { icon: "✅", title: "Vetted Sellers", desc: "Every seller is verified by our team. Only trusted farms and suppliers make the cut." },
  { icon: "🚛", title: "Doorstep Delivery", desc: "Convenient delivery right to your farm gate. Nationwide coverage across Uganda." },
  { icon: "🏅", title: "Quality Assured", desc: "All products meet high quality standards. Your satisfaction is guaranteed." },
]

const stats = [
  { value: "3,000+", label: "Farmers Registered" },
  { value: "500+", label: "Verified Sellers" },
  { value: "30+", label: "Districts Covered" },
  { value: "98%", label: "Delivery Success" },
]

export function Landing() {
  const navigate = useNavigate();

  return (
    <div>
      <Hero />

      <section id="how-it-works" className="max-w-container-max mx-auto mt-20 px-margin-mobile md:px-margin-desktop scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">How P1G Market Works</h2>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">Getting started is easy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-3xl mb-5 dark:bg-primary-fixed/20">
              👤
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 dark:text-primary-fixed">Step 1 — Create Your Account</h3>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Sign up as a farmer, seller, or buyer. Sellers are verified within 24 hours.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-3xl mb-5 dark:bg-primary-fixed/20">
              🛒
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 dark:text-primary-fixed">Step 2 — Browse & Order</h3>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Search for pigs, feed, medicines and more. Add to cart and pay via MTN/Airtel Mobile Money.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-3xl mb-5 dark:bg-primary-fixed/20">
              🚚
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2 dark:text-primary-fixed">Step 3 — Get Delivery</h3>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Real-time tracking. Products delivered to your farm anywhere in Uganda.</p>
          </div>
        </div>
      </section>

      <section id="services" className="max-w-container-max mx-auto mt-24 px-margin-mobile md:px-margin-desktop scroll-mt-20">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-label-sm font-label-sm mb-4 dark:bg-amber-900/20 dark:text-amber-400">Premium Services</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">What We Offer</h2>
          <p className="text-on-surface-variant font-body-md text-body-md dark:text-outline-variant">Everything your piggery needs, all in one place</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-surface-container-lowest rounded-lg p-7 shadow-[0_4px_20px_rgba(27,67,50,0.06)] hover:shadow-[0_8px_30px_rgba(27,67,50,0.10)] transition-shadow duration-300 dark:bg-surface-dim dark:border dark:border-surface-container">
              <div className="w-14 h-14 rounded-lg bg-[#e8fff0] flex items-center justify-center text-3xl mb-5 dark:bg-surface-container">
                {s.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed">{s.title}</h3>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Premium</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-container-max mx-auto my-24 px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-surface-container-lowest rounded-lg p-7 shadow-[0_4px_20px_rgba(27,67,50,0.06)] hover:shadow-[0_8px_30px_rgba(27,67,50,0.10)] transition-shadow duration-300 text-center dark:bg-surface-dim dark:border dark:border-surface-container">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3 dark:text-primary-fixed">{f.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-container-max mx-auto my-24 px-margin-mobile md:px-margin-desktop scroll-mt-20">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-label-sm font-label-sm mb-4 dark:bg-amber-900/20 dark:text-amber-400">Trusted Platform</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface dark:text-primary-fixed">About P1G katale</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="font-headline-md text-headline-md text-on-surface dark:text-primary-fixed leading-snug">
              We help buyers and sellers meet in a unified marketplace.
            </p>
            <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-outline-variant leading-relaxed">
              Our platform connects pig farmers, breeders, feed suppliers, veterinary professionals, and pork buyers — all in one trusted space.
            </p>
            <div className="flex items-start gap-3 bg-[#e8fff0] rounded-lg p-4 dark:bg-surface-container">
              <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Vetted & Trusted</p>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Every seller is carefully vetted by our admin team. Buyers can trust any seller for their pork or porcine needs, knowing quality and authenticity are guaranteed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#e8fff0] rounded-lg p-4 dark:bg-surface-container">
              <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <div>
                <p className="font-label-lg text-label-lg text-on-surface dark:text-primary-fixed">Escrow Protected</p>
                <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">Payments are held securely until orders are confirmed delivered. Your money is always protected.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest rounded-lg p-7 text-center shadow-[0_4px_20px_rgba(27,67,50,0.06)] dark:bg-surface-dim dark:border dark:border-surface-container">
                <p className="font-headline-xl text-headline-xl text-primary dark:text-primary-fixed mb-1">{stat.value}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto mt-24 px-margin-mobile md:px-margin-desktop">
        <div className="bg-[#002114] rounded-3xl p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="relative z-10 text-white max-w-xl">
            <h2 className="font-headline-lg text-headline-lg mb-4">Ready to transform your piggery business?</h2>
            <p className="font-body-lg text-body-lg text-white/80">Join over 3,000 farmers and sellers already using P1G Market</p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-primary font-label-lg text-label-lg px-8 py-4 rounded-xl hover:bg-surface-container-low transition-all active:scale-95 dark:bg-on-primary dark:text-primary"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/market')}
              className="text-white border border-white/30 font-label-lg text-label-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-all active:scale-95"
            >
              Browse Market
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#002114] text-white/60 pt-12 pb-8 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                  <img src="/logo.png" alt="P1G Market" className="h-7 w-7 object-contain" />
                </div>
                <span className="font-headline-md text-headline-md font-bold text-white">P1G Market</span>
              </div>
              <p className="text-label-sm max-w-xs">Secured & verified platform for Uganda&apos;s piggery industry.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="text-label-sm hover:text-white transition-colors">About</a>
              <a href="#" className="text-label-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-label-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-label-sm hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-6 border-t border-white/10">
            <p className="text-label-sm text-white/40">© 2025 P1G Market Uganda. All rights reserved.</p>
            <div className="flex items-center gap-1 text-label-sm text-white/40">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Secured & verified platform
              <span className="mx-2">·</span>
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              Nationwide Uganda delivery
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
