import { useState, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (n: number) => string;
}

export function RangeSlider({ min, max, value, onChange, formatValue = (n) => String(n) }: RangeSliderProps) {
  const [local, setLocal] = useState<[number, number]>(value);

  useEffect(() => setLocal(value), [value[0], value[1]]);

  const span = Math.max(max - min, 1);
  const lowPct = ((local[0] - min) / span) * 100;
  const highPct = ((local[1] - min) / span) * 100;

  const commit = (next: [number, number]) => onChange(next);

  return (
    <div className="w-full px-1 pt-1 pb-2 min-w-[220px]">
      <div className="flex justify-between mb-2 font-label-sm text-label-sm text-on-surface dark:text-primary-fixed">
        <span>{formatValue(local[0])}</span>
        <span>{formatValue(local[1])}</span>
      </div>
      <div className="relative h-5">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 rounded-full bg-surface-container-high dark:bg-surface-container" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-primary dark:bg-primary-fixed"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={local[0]}
          onChange={(e) => setLocal([Math.min(Number(e.target.value), local[1]), local[1]])}
          onMouseUp={() => commit(local)}
          onTouchEnd={() => commit(local)}
          onKeyUp={() => commit(local)}
          className="range-slider-thumb absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 w-full cursor-pointer"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={local[1]}
          onChange={(e) => setLocal([local[0], Math.max(Number(e.target.value), local[0])])}
          onMouseUp={() => commit(local)}
          onTouchEnd={() => commit(local)}
          onKeyUp={() => commit(local)}
          className="range-slider-thumb absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1.5 w-full cursor-pointer"
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}
