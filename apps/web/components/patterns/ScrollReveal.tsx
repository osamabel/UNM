'use client';

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Entrance direction */
  from?: RevealFrom;
  /** Transition duration in ms */
  duration?: number;
  /** Soft blur during entrance */
  blur?: boolean;
  as?: 'div' | 'li' | 'article' | 'section';
}

const HIDDEN: Record<RevealFrom, string> = {
  up: 'translate-y-10 opacity-0',
  down: '-translate-y-8 opacity-0',
  left: '-translate-x-10 opacity-0',
  right: 'translate-x-10 opacity-0',
  scale: 'scale-[0.92] opacity-0',
  fade: 'opacity-0',
};

/**
 * Reveals once the element approaches the fold. Biased toward showing content:
 * anything already level with the fold, and anything we cannot measure, is
 * revealed immediately rather than left to the observer — a missed
 * notification here means copy that never becomes visible at all.
 */
function useRevealOnApproach<T extends HTMLElement>(rootMargin: string) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const viewportH = window.innerHeight;
    if (!viewportH || el.getBoundingClientRect().top < viewportH) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  from = 'up',
  duration = 850,
  blur = true,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const { ref, visible } = useRevealOnApproach<HTMLElement>('0px 0px -10% 0px');

  return (
    <Tag
      ref={ref as never}
      className={cn(
        'home-reveal will-change-transform motion-reduce:transition-none',
        visible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0'
          : cn(HIDDEN[from], blur && 'blur-[6px]'),
        className,
      )}
      style={
        {
          transitionDuration: `${duration}ms`,
          transitionDelay: visible ? `${delay}ms` : '0ms',
        } as CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** Base delay before first child */
  delay?: number;
  /** Gap between children */
  stagger?: number;
  from?: RevealFrom;
  duration?: number;
  blur?: boolean;
  as?: 'div' | 'ul' | 'ol';
  itemAs?: 'div' | 'li';
  itemClassName?: string;
}

/**
 * Observes once, then staggers child entrances for polished cascades.
 */
export function StaggerReveal({
  children,
  className,
  delay = 0,
  stagger = 90,
  from = 'up',
  duration = 800,
  blur = true,
  as: Tag = 'div',
  itemAs: ItemTag = 'div',
  itemClassName,
}: StaggerRevealProps) {
  const { ref, visible } = useRevealOnApproach<HTMLElement>('0px 0px -8% 0px');

  const items = Children.toArray(children);

  return (
    <Tag ref={ref as never} className={className}>
      {items.map((child, i) => {
        const key = isValidElement(child) && child.key != null ? child.key : i;
        return (
          <ItemTag
            key={key}
            className={cn(
              'home-reveal will-change-transform motion-reduce:transition-none',
              visible
                ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0'
                : cn(HIDDEN[from], blur && 'blur-[5px]'),
              itemClassName,
            )}
            style={
              {
                transitionDuration: `${duration}ms`,
                transitionDelay: visible ? `${delay + i * stagger}ms` : '0ms',
              } as CSSProperties
            }
          >
            {child}
          </ItemTag>
        );
      })}
    </Tag>
  );
}
