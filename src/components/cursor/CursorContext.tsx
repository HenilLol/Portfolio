import React, { createContext, useContext, useState, useCallback } from 'react';

export type CursorType =
  | 'default'
  | 'interactive'
  | 'project'
  | 'explore'
  | 'view'
  | 'open'
  | 'drag'
  | 'rotate'
  | 'scroll'
  | 'play'
  | 'hidden';

export interface CursorContextValue {
  cursorType: CursorType;
  cursorLabel: string | null;
  setCursor: (type: CursorType, label?: string | null) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextValue>({
  cursorType: 'default',
  cursorLabel: null,
  setCursor: () => {},
  resetCursor: () => {},
});

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  const setCursor = useCallback((type: CursorType, label: string | null = null) => {
    setCursorType(type);
    setCursorLabel(label);
  }, []);

  const resetCursor = useCallback(() => {
    setCursorType('default');
    setCursorLabel(null);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorType, cursorLabel, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
};

export function useCursor(): CursorContextValue {
  return useContext(CursorContext);
}
