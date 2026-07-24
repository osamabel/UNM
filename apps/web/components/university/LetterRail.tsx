'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface LetterRailItem {
  id: string;
  label: string;
}

/** Fraction of the viewport treated as the "reading line". */
const READING_LINE = 0.38;

/**
 * Sticky table of contents for the president's letter that tracks the
 * movement currently being read and lets the reader jump between them.
 */
export function LetterRail({ eyebrow, items }: { eyebrow: string; items: LetterRailItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    let frame = 0;

    const sync = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      let current = items[0]?.id ?? '';
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === activeId),
  );

  return (
    <nav aria-label={eyebrow}>
      <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/40">
        {eyebrow}
      </p>

      <ol className="relative mt-5 space-y-3 border-l border-warm-200/80 pl-4">
        <span
          aria-hidden
          className="absolute -left-px top-0 w-px bg-primary/70 transition-[height] duration-500 ease-out motion-reduce:transition-none"
          style={{ height: `${((activeIndex + 1) / items.length) * 100}%` }}
        />

        {items.map((item, i) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-baseline gap-2.5"
              >
                <span
                  className={cn(
                    'font-heading text-[10px] font-semibold tabular-nums transition-colors duration-300',
                    isActive ? 'text-primary' : 'text-primary/45',
                  )}
                >
                  0{i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm transition-colors duration-300 group-hover:text-primary',
                    isActive ? 'font-medium text-secondary' : 'text-secondary/55',
                  )}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
