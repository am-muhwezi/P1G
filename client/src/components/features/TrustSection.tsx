export function TrustSection() {
  return (
    <section className="bg-surface-container py-20 dark:bg-surface-container">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 dark:text-primary-fixed">Why P1G Kataale?</h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl mx-auto dark:text-outline-variant">
            We bridge the gap between rural farmers and commercial buyers through transparency and security.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon="verified_user"
            title="Secure Payments"
            description="Payments are processed securely and only released once delivery and quality are confirmed. Peace of mind for both parties."
          />
          <FeatureCard
            icon="health_and_safety"
            title="Health Certified"
            description="Every live animal listing requires a recent veterinary certificate. We ensure only healthy stock enters the market."
          />
          <FeatureCard
            icon="handshake"
            title="Verified Farmers"
            description="Our field team physically inspects farms and verifies seller identities to maintain a premium ecosystem."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-6 dark:bg-primary-fixed/20 dark:text-primary-fixed">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-3 dark:text-primary-fixed">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">{description}</p>
    </div>
  );
}
