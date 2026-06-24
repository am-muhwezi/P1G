import { OrderTimeline } from '../components/features/OrderTimeline';
import { TransactionLog } from '../components/features/TransactionLog';
import { sampleOrder } from '../data/mock';

const activityLog = [
  { label: 'Payment confirmed', timestamp: 'Oct 25, 2023 • 14:32 PM' },
  { label: 'Buyer initiated payment via Mobile Money', timestamp: 'Oct 24, 2023 • 09:15 AM' },
  { label: 'Order created by Buyer', timestamp: 'Oct 24, 2023 • 08:45 AM', isCompleted: false },
];

export function OrderTracking() {
  const order = sampleOrder;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-32">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-stack-md shadow-sm border border-surface-container-high flex flex-col md:flex-row gap-6 items-center dark:bg-surface-dim dark:border-surface-container">
          <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0">
            <img className="w-full h-full object-cover" src={order.product.images[0]} alt={order.product.title} />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 dark:bg-secondary-fixed-dim dark:text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                Payment secured
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1 dark:text-primary-fixed">Order #{order.orderId}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 dark:text-outline-variant">{order.product.title}</p>
            <div className="flex flex-wrap gap-4 text-label-lg font-label-lg">
              <div className="flex items-center gap-1 text-on-surface dark:text-primary-fixed">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">pin_drop</span>
                {order.deliveryLocation}
              </div>
              <div className="flex items-center gap-1 text-on-surface dark:text-primary-fixed">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">calendar_today</span>
                Ordered {order.orderedAt}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-sm border border-surface-container-high flex flex-col justify-between dark:bg-surface-dim dark:border-surface-container">
          <div>
            <h3 className="font-label-lg text-label-lg text-outline uppercase tracking-wider mb-4 dark:text-outline-variant">Transaction ID</h3>
            <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between mb-6 dark:bg-surface-container">
              <code className="text-primary font-bold dark:text-primary-fixed">{order.secureTxId}</code>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors dark:text-outline-variant dark:hover:text-primary-fixed">content_copy</span>
            </div>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all dark:bg-primary-fixed dark:text-on-primary-fixed">
              <span className="material-symbols-outlined">support_agent</span>
              Contact Support
            </button>
            <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-all dark:border-primary-fixed dark:text-primary-fixed dark:hover:bg-surface-container">
              <span className="material-symbols-outlined">description</span>
              View Details
            </button>
          </div>
        </div>
      </section>

      <OrderTimeline status={order.status} progressPercent={order.progressPercent} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <TransactionLog entries={activityLog} />

        <section className="bg-primary-container text-on-primary-container rounded-xl p-stack-md shadow-sm flex flex-col justify-between dark:bg-primary dark:text-on-primary">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[32px]">verified_user</span>
              <h3 className="font-headline-md text-headline-md">Secure Trading</h3>
            </div>
            <p className="font-body-md opacity-90 mb-6">
              Your payment is handled securely. Funds are only released to the seller once you have confirmed receipt and quality. Our support team is ready to help with any concerns.
            </p>
            <ul className="space-y-3 font-label-lg">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                Verified Sellers Only
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                Inspection Window
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                Dispute Support
              </li>
            </ul>
          </div>
          <div className="mt-8 bg-on-primary-container/10 p-4 rounded-lg border border-on-primary-container/20 dark:bg-on-primary/10 dark:border-on-primary/20">
            <p className="text-label-sm italic opacity-80">
              "Agriculture is our foundation. Trust is our bridge." — P1G katale
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
