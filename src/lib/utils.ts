import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Custom tailwind-merge configuration.
 *
 * The project defines custom display font sizes (text-display-2xl … text-display-sm)
 * in tailwind.config.js. tailwind-merge does not know them and would classify them as
 * text-COLOR classes, so any later text-{color} utility (e.g. text-foreground) would
 * strip the display size — silently killing the typographic scale. Register them as
 * font-size classes so sizes and colors merge independently.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-display-2xl',
        'text-display-xl',
        'text-display-lg',
        'text-display-md',
        'text-display-sm',
      ],
    },
  },
});

/**
 * Merge Tailwind class names with proper override handling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date string into human readable format.
 */
export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}
