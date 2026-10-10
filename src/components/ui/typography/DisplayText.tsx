import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm';
  children: React.ReactNode;
  /** When true, the heading decrypts from a cipher character storm on first view (default true) */
  scramble?: boolean;
}

// Character storm alphabet — technical glyphs that match the HUD aesthetic
const CIPHER_CHARS = '█▓▒░<>/\\|=+*#@$%&01'.split('');

/**
 * Resolves the plain text of a React node tree for scrambling.
 */
function resolveText(node: React.ReactNode): string {
  if (node === null || node === undefined || node === false || node === true) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(resolveText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return resolveText(props?.children);
  }
  return '';
}

export const DisplayText: React.FC<DisplayTextProps> = ({
  as: Component = 'h2',
  size = 'lg',
  className,
  children,
  scramble = true,
  ...props
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reducedMotion = useReducedMotion();

  const plainText = React.useMemo(() => resolveText(children), [children]);
  const shouldScramble = scramble && !reducedMotion && plainText.length > 0 && plainText.length <= 40;

  const [display, setDisplay] = useState<string>(plainText);

  useEffect(() => {
    if (!shouldScramble || !inView) return;

    let frame = 0;
    let raf = 0;
    const totalFrames = 26; // ~0.45s at 60fps
    const step = () => {
      frame++;
      const t = frame / totalFrames;
      const resolved = Math.floor(t * plainText.length);
      let out = '';
      for (let i = 0; i < plainText.length; i++) {
        const ch = plainText[i];
        if (ch === ' ') { out += ' '; continue; }
        if (i < resolved) {
          out += ch;
        } else if (t < 1) {
          out += CIPHER_CHARS[(i * 7 + frame * 3) % CIPHER_CHARS.length];
        }
      }
      setDisplay(out);
      if (frame < totalFrames) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(plainText);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, shouldScramble, plainText]);

  const sizeClasses = {
    '2xl': 'text-display-2xl',
    'xl': 'text-display-xl',
    'lg': 'text-display-lg',
    'md': 'text-display-md',
    'sm': 'text-display-sm',
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'font-editorial font-bold uppercase text-foreground tracking-tightest leading-none',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {shouldScramble ? display : children}
    </Component>
  );
};
