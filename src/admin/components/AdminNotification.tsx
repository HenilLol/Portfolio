import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface AdminNotificationProps {
  type: NotificationType;
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export const AdminNotification: React.FC<AdminNotificationProps> = ({
  type,
  message,
  className,
  onDismiss,
}) => {
  const styles = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    loading: 'border-accent/30 bg-accent/10 text-accent',
  };

  const icons = {
    success: <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />,
    error: <XCircle size={16} className="shrink-0 text-red-400" />,
    warning: <AlertTriangle size={16} className="shrink-0 text-amber-400" />,
    info: <Info size={16} className="shrink-0 text-cyan-400" />,
    loading: <Loader2 size={16} className="shrink-0 text-accent animate-spin" />,
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={cn(
        'p-3 border text-xs font-mono flex items-center justify-between gap-3 transition-all',
        styles[type],
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        {icons[type]}
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-foreground-muted hover:text-foreground text-xs uppercase tracking-wider cursor-pointer"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
};
