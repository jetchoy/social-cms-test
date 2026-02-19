import { useState, useRef, useCallback } from 'react';

interface UseImageEditorReturn {
  isOpen: boolean;
  open: (src: string, onSave: (dataUrl: string) => void) => void;
  close: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  fieRef: React.MutableRefObject<FilerobotImageEditorInstance | null>;
  currentSrc: string;
  currentOnSave: React.MutableRefObject<((dataUrl: string) => void) | null>;
}

/** Minimal type for the Filerobot Image Editor instance */
interface FilerobotImageEditorInstance {
  render: () => void;
  terminate: () => void;
}

/**
 * Manages the Filerobot Image Editor lifecycle: open, close, save.
 * The FIE instance is created and torn down imperatively inside
 * ImageEditorModal, which calls fieRef and containerRef.
 */
export function useImageEditor(): UseImageEditorReturn {
  const [isOpen, setIsOpen]       = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const containerRef              = useRef<HTMLDivElement | null>(null);
  const fieRef                    = useRef<FilerobotImageEditorInstance | null>(null);
  const currentOnSave             = useRef<((dataUrl: string) => void) | null>(null);

  const open = useCallback((src: string, onSave: (dataUrl: string) => void) => {
    setCurrentSrc(src);
    currentOnSave.current = onSave;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    if (fieRef.current) {
      fieRef.current.terminate();
      fieRef.current = null;
    }
    if (containerRef.current) containerRef.current.innerHTML = '';
    setIsOpen(false);
  }, []);

  return { isOpen, open, close, containerRef, fieRef, currentSrc, currentOnSave };
}
