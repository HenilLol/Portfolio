import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-md border border-border-subtle bg-background-surface p-6 shadow-2xl space-y-4">
        <div className="space-y-1">
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase block">
            Confirmation Protocol
          </span>
          <h3
            id="confirm-modal-title"
            className="font-editorial text-lg font-bold uppercase tracking-tight text-foreground"
          >
            {title}
          </h3>
        </div>

        <p className="font-mono text-xs text-foreground-secondary leading-relaxed">
          {message}
        </p>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDestructive ? 'bg-red-500/90 hover:bg-red-600 text-white border-none' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
