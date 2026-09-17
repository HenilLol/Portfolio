import React, { useEffect, useRef } from 'react';

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-2xl',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const titleId = 'admin-modal-title';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`w-full ${maxWidthClass} border border-border-subtle bg-background-surface p-6 shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto focus:outline-none`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
          <div>
            {subtitle && (
              <span className="font-mono text-[10px] tracking-widest text-accent uppercase block">
                {subtitle}
              </span>
            )}
            <h3 id={titleId} className="font-editorial text-xl font-bold uppercase tracking-tight text-foreground">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-foreground-muted hover:text-foreground text-sm font-mono cursor-pointer p-1 rounded focus:outline-none focus:ring-1 focus:ring-accent"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
