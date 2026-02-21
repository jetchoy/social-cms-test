import { useEffect, useRef } from 'react';
import styles from './ImageEditorModal.module.css';

// Filerobot Image Editor is loaded as a UMD bundle; declare global
declare global {
  interface Window {
    FilerobotImageEditor: {
      new (
        container: HTMLElement,
        config: Record<string, unknown>,
      ): { render(): void; terminate(): void };
      TABS: Record<string, string>;
      TOOLS: Record<string, string>;
    };
  }
}

interface Props {
  src: string;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

/**
 * Filerobot Image Editor wrapped in a full-screen overlay.
 * The FIE script is loaded once from CDN via index.html; the instance
 * is created/destroyed on mount/unmount.
 */
export function ImageEditorModal({ src, onSave, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieRef       = useRef<{ render(): void; terminate(): void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !window.FilerobotImageEditor) return;

    const { TABS, TOOLS } = window.FilerobotImageEditor;

    fieRef.current = new window.FilerobotImageEditor(containerRef.current, {
      source: src,

      onSave(imageData: { imageBase64?: string }) {
        if (imageData.imageBase64) {
          onSave(imageData.imageBase64);
        }
        closeSelf();
      },

      onClose() { closeSelf(); },

      tabsIds: [
        TABS.ADJUST,
        TABS.FINETUNE,
        TABS.FILTERS,
        TABS.ANNOTATE,
        TABS.WATERMARK,
        // TABS.RESIZE omitted — resizing would break the fixed 4:5 aspect ratio
      ],
      defaultTabId: TABS.ADJUST,
      // TOOLS.CROP and TOOLS.ROTATE omitted — both would alter the 4:5 aspect ratio

      savingPixelRatio:  window.devicePixelRatio || 1,
      previewPixelRatio: window.devicePixelRatio || 1,

      onBeforeSave: () => false,
      defaultSavedImageName: 'slide',
      defaultSavedImageType: 'jpeg',

      theme: {
        palette: document.documentElement.getAttribute('data-theme') === 'dark' ? {
          'bg-primary':             '#1e293b',
          'bg-secondary':           '#152030',
          'bg-primary-active':      'rgba(59,130,246,0.15)',
          'bg-primary-hover':       'rgba(255,255,255,0.06)',
          'bg-hover':               'rgba(255,255,255,0.06)',
          'bg-stateless':           '#1e293b',
          'bg-base-light':          '#334155',
          'bg-base-medium':         '#475569',
          'txt-primary':            '#cbd5e1',
          'txt-secondary':          '#94a3b8',
          'txt-placeholder':        '#64748b',
          'icons-primary':          '#cbd5e1',
          'icons-secondary':        '#64748b',
          'icons-muted':            '#475569',
          'borders-primary':        '#475569',
          'borders-secondary':      '#334155',
          'borders-strong':         '#64748b',
          'borders-item':           '#334155',
          'borders-button':         '#475569',
          'borders-disabled':       '#334155',
          'accent-primary':         '#3b82f6',
          'accent-primary-active':  '#2563eb',
          'accent-primary-hover':   '#2563eb',
          'accent-stateless':       '#3b82f6',
          'btn-primary-text':       '#ffffff',
          'btn-secondary-text':     '#cbd5e1',
          'btn-disabled-text':      'rgba(203,213,225,0.4)',
          'gradient-right':         'linear-gradient(to left,  #1e293b 40%, transparent)',
          'gradient-right-active':  'linear-gradient(to left,  #152030 40%, transparent)',
          'gradient-right-hover':   'linear-gradient(to left,  #334155 40%, transparent)',
          'light-shadow':           'rgba(255,255,255,0.08)',
          'large-shadow':           'rgba(0,0,0,0.6)',
          'warning':                '#ef4444',
        } : {
          'bg-primary':             '#ffffff',
          'bg-secondary':           '#f1f5f9',
          'bg-primary-active':      'rgba(59,130,246,0.08)',
          'bg-hover':               'rgba(0,0,0,0.04)',
          'bg-primary-hover':       'rgba(0,0,0,0.04)',
          'bg-base-light':          '#f8fafc',
          'bg-base-medium':         '#e2e8f0',
          'txt-primary':            '#334155',
          'txt-secondary':          '#64748b',
          'txt-placeholder':        '#94a3b8',
          'accent-primary':         '#3b82f6',
          'accent-primary-active':  '#2563eb',
          'accent-primary-hover':   '#2563eb',
          'accent-stateless':       '#3b82f6',
          'icons-primary':          '#334155',
          'icons-secondary':        '#94a3b8',
          'borders-primary':        '#cbd5e1',
          'borders-secondary':      '#e2e8f0',
          'borders-strong':         '#475569',
          'borders-item':           '#e2e8f0',
          'borders-button':         '#cbd5e1',
          'btn-primary-text':       '#ffffff',
          'gradient-right':         'linear-gradient(to left,  #ffffff 40%, transparent)',
          'gradient-right-active':  'linear-gradient(to left,  #f1f5f9 40%, transparent)',
          'gradient-right-hover':   'linear-gradient(to left,  #f1f5f9 40%, transparent)',
          'light-shadow':           'rgba(0,0,0,0.05)',
          'large-shadow':           'rgba(0,0,0,0.25)',
          'warning':                '#ef4444',
        },
        typography: {
          fontFamily: "'Geist', Arial, sans-serif",
        },
      },
    });

    fieRef.current.render();

    return () => {
      fieRef.current?.terminate();
      fieRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function closeSelf() {
    fieRef.current?.terminate();
    fieRef.current = null;
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) closeSelf();
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Image editor"
      onClick={handleBackdropClick}
    >
      <div ref={containerRef} className={styles.container} />
    </div>
  );
}
