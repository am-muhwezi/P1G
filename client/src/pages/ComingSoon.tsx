import { useState, useEffect } from "react"

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now())
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  return {
    days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
  }
}

export default function ComingSoon() {
  const [launchDate] = useState(() => {
    return new Date(Date.now() + 72 * 60 * 60 * 1000)
  })
  const countdown = useCountdown(launchDate)

  const [formState, setFormState] = useState<"idle" | "loading" | "done">("idle")
  const [formData, setFormData] = useState({ name: "", email: "", phone: "+256", interest: "buyer" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formState === "done") return

    // Save to localStorage for admin dashboard
    const entry = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    }
    try {
      const raw = localStorage.getItem("p1g-waitlist")
      const existing = raw ? JSON.parse(raw) : []
      existing.unshift(entry)
      localStorage.setItem("p1g-waitlist", JSON.stringify(existing))
    } catch { /* ignore */ }

    setFormState("done")

    setTimeout(() => {
      setFormState("idle")
      setFormData({ name: "", email: "", phone: "+256", interest: "buyer" })
    }, 3000)

    // Fire-and-forget POST to backend
    fetch(`${import.meta.env.VITE_API_URL}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).catch(() => {})
  }

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="min-h-screen bg-[#fff8f6] text-[#2e150b] font-body-md selection:bg-[#a3f69c] selection:text-[#002204]">
      <header className="fixed top-0 w-full z-50 bg-[#fff8f6]/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center px-5 md:px-16 py-4 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3">
            <img
              alt="PorcineHub Logo"
              className="h-10 w-10 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhhMd-K2Mc4vUo_A-O7TSGkPf8vvNFSrcl_5gZO4LXfmMrdXGwPqPZR-akDfVD6fkZkXALRW2o_nWhlSf0TOvA9rTWRGOijDRotOC-FGZ3EbmZYxEtdu59MvUWeD8UjkOCTdoTRrM919hZWKCtRxuTJvN0mf7hghwKs9wwEccm01g7L-1FOjPXHJimBJM7ptV19Mmua7mP0P-Fsczv--3F7OGpV7tsWSGJi2sT_n8WcXEcb0vGdu3LVIq8elJ-42ANplhg1kTsUjk"
            />
            <span className="font-['Plus_Jakarta_Sans'] text-[24px] font-bold text-[#0d631b]">P1G katale</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] text-[#40493d] hover:text-[#0d631b] transition-colors">
              Why P1G katale?
            </a>
            <a href="#share" className="font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] text-[#40493d] hover:text-[#0d631b] transition-colors">
              Spread the Word
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block px-3 py-1 bg-[#ffdfa0] text-[#261a00] rounded-full text-[12px] font-bold">
              COMING SOON
            </span>
            <span className="material-symbols-outlined text-[#40493d]">notifications</span>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center scale-105 opacity-30"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2K2t_J2XPNXTunPqr7k3Zzg7WTSw5GcrEFmoa_mPGInH-A_1N9pruGaOX7N5qoKDlYmB9bCl-PZqLjgd3c3LuFHYWtxTZ4sdxuMP7F2p6pwqPq2FiwvQGsyWpVx_dkHt38-bWjkWvZq8oAALTwAkUeXqUQeWLDzEorr4Q2NAoSQ4HxHuZDlIXoPxnPTgU7oFJYZ1eOGi_Cqjsaqc_6mMxk7zb9_05AhDjqsXLJq744ZFlNbqdko8yGB-_bWFj5LUFfGgPaGrCRHg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff8f6] via-[#fff8f6]/40 to-[#fff8f6]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#91f78e] text-[#00731e] rounded-full mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em]">Uganda's Premier Livestock Platform</span>
            </div>

            <h1 className="font-['Plus_Jakarta_Sans'] text-[48px] md:text-[64px] font-extrabold leading-[56px] md:leading-[72px] tracking-[-0.02em] text-[#0d631b] mb-3">
              The Future of Pig Farming is <span className="text-[#6e5100]">Almost Here</span>
            </h1>

            <p className="font-['Plus_Jakarta_Sans'] text-[18px] leading-[28px] text-[#40493d] mb-12 max-w-2xl mx-auto">
              Join the waitlist for Uganda's most trusted livestock marketplace. Get notified when we launch.
            </p>

            {/* Countdown */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
              {[
                { label: "DAYS", value: pad(countdown.days) },
                { label: "HOURS", value: pad(countdown.hours) },
                { label: "MINS", value: pad(countdown.minutes) },
                { label: "SECS", value: pad(countdown.seconds), accent: true },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center px-6 py-4 bg-[#ffe9e3] rounded-2xl shadow-sm border border-[#bfcaba]/10">
                  <span className={`font-['Plus_Jakarta_Sans'] text-[48px] font-extrabold leading-[56px] tracking-[-0.02em] ${item.accent ? "text-[#6e5100]" : "text-[#0d631b]"}`}>
                    {item.value}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] text-[#40493d]">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Signup Form Card */}
            <div className="bg-[#fff8f6]/80 backdrop-blur-[12px] border border-[#bfcaba]/20 rounded-3xl p-6 md:p-12 shadow-xl max-w-2xl mx-auto mb-12">
              <h3 className="font-['Plus_Jakarta_Sans'] text-[24px] font-semibold leading-[32px] text-[#0d631b] mb-4 text-left">
                Secure your early access
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-4 px-1 bg-white text-[#40493d] text-[12px] rounded">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Mukasa"
                    className="w-full bg-white border border-[#bfcaba] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#0d631b] focus:border-transparent outline-none transition-all placeholder:text-[#707a6c]/60"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-[#40493d] text-[12px] rounded">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="example@farm.com"
                      className="w-full bg-white border border-[#bfcaba] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#0d631b] focus:border-transparent outline-none transition-all placeholder:text-[#707a6c]/60"
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2.5 left-4 px-1 bg-white text-[#40493d] text-[12px] rounded">
                      WhatsApp / SMS
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+256 700 000 000"
                      className="w-full bg-white border border-[#bfcaba] rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-[#0d631b] focus:border-transparent outline-none transition-all placeholder:text-[#707a6c]/60"
                      value={formData.phone}
                      onChange={e => {
                        const raw = e.target.value
                        // Strip anything that isn't a digit or leading +
                        const cleaned = raw.replace(/[^\d+]/g, "")
                        // Enforce +256 prefix, let user type after position 4
                        if (!cleaned.startsWith("+256")) {
                          setFormData(p => ({ ...p, phone: "+256" }))
                        } else {
                          setFormData(p => ({ ...p, phone: cleaned }))
                        }
                      }}
                    />
                  </div>
                </div>

                {/* I'm interested in — pill toggle */}
                <div className="bg-[#ffe9e3] rounded-xl p-1 flex">
                  {(["buyer", "both", "seller"] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, interest: opt }))}
                      className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                        formData.interest === opt
                          ? "bg-white text-[#0d631b] shadow-sm"
                          : "text-[#707a6c] hover:text-[#40493d]"
                      }`}
                    >
                      {opt === "buyer" ? "🐷 Buyer" : opt === "seller" ? "🌾 Seller" : "🤝 Both"}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className={`w-full font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] py-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                    formState === "done"
                      ? "bg-[#8c6800] text-[#ffefd7]"
                      : "bg-[#0d631b] text-white hover:bg-[#0d631b]/90 hover:scale-[1.01] active:scale-95"
                  }`}
                >
                  {formState === "idle" && (
                    <>
                      <span>Notify Me at Launch</span>
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                  {formState === "loading" && (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      <span>Adding you to waitlist...</span>
                    </>
                  )}
                  {formState === "done" && (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>You're on the list!</span>
                    </>
                  )}
                </button>
              </form>
              <p className="mt-4 text-[12px] text-[#707a6c] italic">
                No spam. Only essential launch updates and early bird offers.
              </p>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-12 px-5 max-w-[1280px] mx-auto" id="features">
          <div className="text-center mb-12">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold leading-[40px] tracking-[-0.01em] text-[#0d631b] mb-4">
              Building Trust in Pig Trading
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] leading-[24px] text-[#40493d] max-w-xl mx-auto">
              We're modernizing the agricultural supply chain in Uganda with technology that works for the farmer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Escrow Card */}
            <div className="md:col-span-8 bg-[#fff1ec] border border-[#bfcaba]/10 rounded-[32px] p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
              <div className="flex-1">
                <div className="w-12 h-12 bg-[#2e7d32] text-[#cbffc2] rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[24px] font-semibold leading-[32px] text-[#0d631b] mb-3">
                  Cash On Delivery
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[16px] leading-[24px] text-[#40493d] mb-6">
                  Never worry about your money again. Our secure platform holds payments until the livestock or Goods are delivered and verified at your farm.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[#6e5100]">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="text-[12px] font-bold">SECURE PAYMENT</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#6e5100]">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="text-[12px] font-bold">VERIFIED DELIVERY</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-[#ffe9e3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAId5ccZ_ZILEtCVRxWSN-xXLuZvfYzGyzw4IVtp-RysEFNkGsOFsbBLBKMqDLTwoCRWSl8gTE5GKhp6JCDdQ0r2PEmAppFYn86yhLQznTEyK1CczMwyDO_4Hf-ZfuPAfpkOLT1rLsacjPtrS14wU-nbFpsXx7JF0GULBOwachzIXCsd_OMbQvEu9WiSqz-epIe_NlOxWPaF67j6eU2qK624exoK9AxkWOIjGvckqRYrU1TH2GDlMaJKTGPsHbwCUfPYsUt_aT8wvM')" }}
                />
              </div>
            </div>

            {/* Verified Breeders Card */}
            <div className="md:col-span-4 bg-[#8c6800] text-[#ffefd7] rounded-[32px] p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 bg-[#ffdfa0] text-[#261a00] rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">stars</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-[24px] font-semibold leading-[32px] mb-3">
                  Verified Breeders
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[16px] leading-[24px] opacity-90">
                  Every seller on P1G katale undergoes a rigorous vetting process. Buy healthy breeds from Uganda's most reputable swine farmers.
                </p>
              </div>
              <div className="mt-8 flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#8c6800] bg-[#ffdbcf] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Farmer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMDgVXFyb7FDDrHJ1-dWAdMJsEPJv94HLHoPbEYhYRt3Zhf7lQquEx2k5FJIB_xsZwUbB7r-m9UQraOwcqAnGLXhxjxtuQi1YxywpqoJvhhlwPLZ74GnK5COpQglcw9amUPj0wzQpmERgy5vMHGGfPi5rdKNrSkR6bSkPyoeL0HG97IYDJtHymukFeeodFgQVIEBFC7mhQpOP3K5E5-Ydt9pmEDh5wAXAvd45nw7kSPioiQ37qBwQxjvGrrG6-rfiBx4WIMND_hew"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#8c6800] bg-[#ffdbcf] overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Vet"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT1MGNeUPRffeGGDjf7MnYnBrAWa5Supq8deZMXX7Mn9Wh3J5pHBi_MVXhyKpM1d6CWc_FqEiufVFXideiDwjwNBi22kQK_MvqKriizZnZ0mjoxjej2HLDeO0YaOK7I5t8HjzaJrcJyhv-lQOEK5Gg6jByg1kfCg_fsB6uCUTeSgQ_dtSm9Hc5OHQP7SZSofPS9lT7wEFJw48q-3FQzFOycNVnqh5z1F8kEJ0VY78Y7A_XWPR9W3X5IAn8KZIFWTeSbv9ufxvezXE"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#8c6800] bg-[#ffdbcf] flex items-center justify-center text-[12px] font-bold text-[#004d40]">
                  +150
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="py-12 bg-[#ffe2d9]/30" id="share">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-sm border border-[#bfcaba]/10">
              <span className="material-symbols-outlined text-[#0d631b] text-[32px]">share</span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-[32px] font-bold leading-[40px] tracking-[-0.01em] text-[#0d631b] mb-4">
              Know someone in pig farming?
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] leading-[24px] text-[#40493d] mb-6">
              Help us build the community. Share P1G Katale with your fellow farmers and wholesalers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/?text=Check%20out%20P1G%20Katale%20%E2%80%93%20Uganda%27s%20most%20trusted%20livestock%20marketplace%20and%20escrow%20platform.%20https%3A%2F%2Fp1gz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] hover:brightness-95 transition-all shadow-md"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>WhatsApp</span>
              </a>
              <button
                onClick={() => navigator.clipboard.writeText("https://p1gz.com")}
                className="flex items-center gap-3 bg-[#46291e] text-[#ffede7] px-6 py-3 rounded-full font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] hover:opacity-90 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">link</span>
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#fff8f6] py-12 px-5 border-t border-[#bfcaba]/10">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-60">
            <img
              alt="PorcineHub Logo"
              className="h-8 w-8 grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhhMd-K2Mc4vUo_A-O7TSGkPf8vvNFSrcl_5gZO4LXfmMrdXGwPqPZR-akDfVD6fkZkXALRW2o_nWhlSf0TOvA9rTWRGOijDRotOC-FGZ3EbmZYxEtdu59MvUWeD8UjkOCTdoTRrM919hZWKCtRxuTJvN0mf7hghwKs9wwEccm01g7L-1FOjPXHJimBJM7ptV19Mmua7mP0P-Fsczv--3F7OGpV7tsWSGJi2sT_n8WcXEcb0vGdu3LVIq8elJ-42ANplhg1kTsUjk"
            />
            <span className="font-['Plus_Jakarta_Sans'] text-[14px] font-semibold tracking-[0.05em] font-bold text-[#2e150b]">P1G katale</span>
          </div>
          <div className="text-[12px] text-[#40493d]">
            &copy; 2026 P1G katale. All rights reserved. Registered under Saverio Farms and Technologies.
          </div>
          <div className="flex gap-3">
            <a href="#" className="text-[#40493d] hover:text-[#0d631b] transition-colors text-[12px] font-bold">Privacy</a>
            <a href="#" className="text-[#40493d] hover:text-[#0d631b] transition-colors text-[12px] font-bold">Terms</a>
            <a href="#" className="text-[#40493d] hover:text-[#0d631b] transition-colors text-[12px] font-bold">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
