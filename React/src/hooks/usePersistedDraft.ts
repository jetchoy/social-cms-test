import { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';

const STORAGE_KEY = 'tatler-cms-draft';

/**
 * Loads a previously saved draft from localStorage on mount,
 * and saves state back on every meaningful change.
 *
 * Images are stored as JPEG data URLs (~100–300 KB each after compression).
 * Production: upload images to a server and persist CDN URLs instead.
 */
export function usePersistedDraft() {
  const store = usePostStore();

  /* ---------- load on mount ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || !Array.isArray(saved.slides) || saved.slides.length === 0) return;

      usePostStore.setState({
        postTitle:       saved.postTitle       ?? 'Untitled post',
        slides:          saved.slides,
        selectedSlideId: saved.selectedSlideId ?? saved.slides[0]?.id ?? null,
        nextSlideId:     saved.nextSlideId     ?? saved.slides.length + 1,
        sidebarOpen:     saved.sidebarOpen     ?? true,
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- persist on change ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          postTitle:       store.postTitle,
          slides:          store.slides,
          selectedSlideId: store.selectedSlideId,
          nextSlideId:     store.nextSlideId,
          sidebarOpen:     store.sidebarOpen,
        }),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn('Draft could not be saved to localStorage:', msg);
    }
  }, [
    store.postTitle,
    store.slides,
    store.selectedSlideId,
    store.nextSlideId,
    store.sidebarOpen,
  ]);
}

export function clearPersistedDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
