interface TransactionLogProps {
  entries: {
    label: string;
    timestamp: string;
    isCompleted?: boolean;
    isActive?: boolean;
  }[];
}

export function TransactionLog({ entries }: TransactionLogProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0px_4px_20px_rgba(27,67,50,0.06)] dark:bg-surface-dim">
      <h3 className="font-headline-md text-headline-md text-primary mb-6 dark:text-primary-fixed">Activity Log</h3>
      <div className="space-y-6">
        {entries.map((entry, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  entry.isCompleted !== false ? 'bg-primary dark:bg-primary-fixed' : 'bg-outline dark:bg-outline-variant'
                }`}
              />
              {idx < entries.length - 1 && <div className="w-0.5 h-full bg-outline-variant mt-2 dark:bg-surface-container" />}
            </div>
            <div>
              <p className={`font-label-lg ${entry.isCompleted !== false ? 'text-on-surface dark:text-primary-fixed' : 'text-outline dark:text-outline-variant'}`}>
                {entry.label}
              </p>
              <p className="text-label-sm text-outline dark:text-outline-variant">{entry.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
