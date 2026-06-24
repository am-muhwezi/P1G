export function Hero() {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMdyV7O60I_AL3t1HDhq1ew7Cbq9DrV9wqYTHOFtBeoOAUKIWvrUOLOzJU0HZpMHzvq9hisuEF3Qpf7LkuFj15gXomZMEi9bANAnbClDQ1vqtoN5F6FrcGHnLxR0B_hudjAGpE_ObTviXYsulgdTlts-IrM4fxuSdhB1v8v6FF9DLfRkqLCsLhhWPeiCdtX6w0AglqLb8fsMgm396YPmLl2Agu0DwwCIDv_gxpVAiH7DT2GWPLXzVK5SHQbETbRqCB3CCxy4du7F4v')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/60 to-transparent dark:from-on-background/80" />
      </div>
      <div className="relative z-10 w-full max-w-container-max px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-surface-container-low/20 backdrop-blur-sm px-4 py-2 rounded-full text-surface-container-low mb-6 text-label-sm font-label-sm">
            🇺🇬 Uganda&apos;s Premier Piggery Platform
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight text-white">
            Uganda&apos;s #1 Piggery
            <br />
            <span className="text-secondary-fixed">Marketplace</span>
          </h1>
          <p className="font-body-lg text-body-lg mb-10 text-surface-container-low/90 max-w-xl">
            Buy & Sell Pigs, Feed, Breeding Semen, Medicines & Vet Services — All in One Place. Nationwide delivery across Uganda.
          </p>
          <div className="flex flex-wrap gap-8">
            <div className="text-center">
              <p className="text-secondary-fixed font-display-lg text-display-lg">2,400+</p>
              <p className="text-surface-container-low font-label-sm text-label-sm">Verified Farmers</p>
            </div>
            <div className="text-center">
              <p className="text-secondary-fixed font-display-lg text-display-lg">150+</p>
              <p className="text-surface-container-low font-label-sm text-label-sm">Trusted Sellers</p>
            </div>
            <div className="text-center">
              <p className="text-secondary-fixed font-display-lg text-display-lg">100%</p>
              <p className="text-surface-container-low font-label-sm text-label-sm">Nationwide Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
