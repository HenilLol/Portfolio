import React from 'react';

export const CanvasFallback: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs">
      <div className="flex flex-col items-center gap-2">
        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-[10px] font-mono tracking-widest text-foreground-muted uppercase">
          Initializing WebGL
        </span>
      </div>
    </div>
  );
};
