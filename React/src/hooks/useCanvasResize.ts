import { useEffect, useRef, useState } from 'react';

const CANVAS_RATIO     = 540 / 675; // 4:5
const CANVAS_MAX       = 540;
const CANVAS_MIN       = 360;
const EDITOR_PAD       = 24;
const DETAILS_W        = 360;
const EDITOR_GAP       = 24;
// Width at which canvas + gap + details no longer fit side by side
export const STACK_THRESHOLD = EDITOR_PAD * 2 + CANVAS_MIN + EDITOR_GAP + DETAILS_W; // 792 px

interface CanvasLayout {
  canvasWidth: number;
  detailsWidth: number | undefined; // undefined = use CSS default (360 px)
  isStacked: boolean;
}

/**
 * Observes the editor container and returns the ideal canvas width
 * that respects both horizontal and vertical constraints.
 * When the viewport is too narrow, switches to stacked layout.
 */
export function useCanvasResize(editorRef: React.RefObject<HTMLElement | null>): CanvasLayout {
  const [layout, setLayout] = useState<CanvasLayout>({
    canvasWidth: CANVAS_MAX,
    detailsWidth: undefined,
    isStacked: false,
  });

  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    function calculate() {
      if (!el) return;
      const editorW = el.clientWidth;
      const editorH = el.clientHeight;
      const stacked = editorW < STACK_THRESHOLD;

      let finalW: number;
      if (stacked) {
        const style  = window.getComputedStyle(el);
        const pad    = parseFloat(style.paddingLeft);
        const availW = editorW - pad * 2;
        finalW = Math.min(CANVAS_MAX, pad >= EDITOR_PAD ? Math.max(CANVAS_MIN, availW) : availW);
      } else {
        const availW   = editorW - EDITOR_PAD * 2 - EDITOR_GAP - DETAILS_W;
        const availH   = editorH - EDITOR_PAD * 2;
        const maxFromH = availH * CANVAS_RATIO;
        finalW = Math.max(CANVAS_MIN, Math.min(CANVAS_MAX, availW, maxFromH));
      }

      setLayout({
        canvasWidth: finalW,
        detailsWidth: stacked ? finalW : undefined,
        isStacked: stacked,
      });
    }

    roRef.current = new ResizeObserver(calculate);
    roRef.current.observe(el);
    calculate();

    return () => roRef.current?.disconnect();
  }, [editorRef]);

  return layout;
}
