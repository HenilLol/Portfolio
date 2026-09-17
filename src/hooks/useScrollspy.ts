import { useState, useEffect } from 'react';

/**
 * High-performance scrollspy hook leveraging native IntersectionObserver.
 * Tracks which section is currently active in the viewport without attaching
 * expensive scroll listeners or causing re-renders on every scroll frame.
 */
export function useScrollspy(
  sectionIds: string[],
  options?: { rootMargin?: string; threshold?: number | number[] }
): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] || '');

  const serializedIds = sectionIds.join(',');
  const rootMargin = options?.rootMargin || '-20% 0px -50% 0px';
  const thresholdKey = Array.isArray(options?.threshold)
    ? options.threshold.join(',')
    : String(options?.threshold ?? '0,0.25,0.5,0.75,1');

  useEffect(() => {
    if (typeof window === 'undefined' || sectionIds.length === 0) return;

    const parsedThreshold = Array.isArray(options?.threshold)
      ? options.threshold
      : typeof options?.threshold === 'number'
      ? options.threshold
      : [0, 0.25, 0.5, 0.75, 1.0];

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold: parsedThreshold,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // Find the entry that has the highest intersection ratio or is currently intersecting
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio descending
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visibleEntries[0];
        if (topEntry.target.id) {
          setActiveId(topEntry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedIds, rootMargin, thresholdKey]);

  return activeId;
}
