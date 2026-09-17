import React from 'react';
import { useCursor, type CursorType } from './CursorContext';

export interface InteractiveCursorTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cursorType?: CursorType;
  cursorLabel?: string;
}

export const InteractiveCursorTarget: React.FC<InteractiveCursorTargetProps> = ({
  children,
  cursorType = 'interactive',
  cursorLabel,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const { setCursor, resetCursor } = useCursor();

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setCursor(cursorType, cursorLabel);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    resetCursor();
    onMouseLeave?.(e);
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};
