const steps = [
  { key: 'placed', label: 'Order Placed', icon: 'receipt' },
  { key: 'confirmed', label: 'Confirmed', icon: 'check_circle' },
  { key: 'in_transit', label: 'In Transit', icon: 'local_shipping' },
  { key: 'delivered', label: 'Delivered', icon: 'handshake' },
  { key: 'completed', label: 'Completed', icon: 'payments' },
] as const;

const stepOrder: Record<string, number> = {
  placed: 0,
  confirmed: 1,
  in_transit: 2,
  delivered: 3,
  completed: 4,
};

export function OrderTimeline({ status, progressPercent }: { status: string; progressPercent: number }) {
  const currentIdx = stepOrder[status] ?? 0;

  return (
    <section className="bg-surface-container-lowest rounded-xl p-stack-md md:p-stack-lg shadow-sm border border-surface-container-high mb-stack-lg overflow-x-auto dark:bg-surface-dim dark:border-surface-container">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-8 dark:text-primary-fixed">Order Progress</h3>
      <div className="min-w-[600px] flex justify-between relative px-4">
        <div className="absolute top-5 left-12 right-12 h-1 bg-outline-variant z-0 dark:bg-surface-container" />
        <div
          className="absolute top-5 left-12 h-1 bg-primary z-0 dark:bg-primary-fixed transition-all"
          style={{ width: `${Math.max(progressPercent, 25)}%` }}
        />
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center text-center w-24">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all ${
                  isCompleted
                    ? 'bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed'
                    : isActive
                    ? 'bg-primary-container text-on-primary-container ring-4 ring-primary-fixed-dim/30 dark:bg-primary dark:text-on-primary dark:ring-primary-fixed-dim/50'
                    : 'bg-outline-variant text-on-surface-variant dark:bg-surface-container dark:text-outline'
                }`}
              >
                <span
                  className={`material-symbols-outlined ${isActive ? 'animate-pulse' : ''}`}
                  style={isCompleted ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {step.icon}
                </span>
              </div>
              <span
                className={`font-label-lg text-label-sm ${
                  isCompleted || isActive
                    ? 'text-primary font-bold dark:text-primary-fixed'
                    : 'text-outline dark:text-outline-variant'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
