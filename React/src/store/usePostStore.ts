import { create } from 'zustand';
import type { Slide, Tag } from '../types';

/* ================================================================
   STATE SHAPE — mirrors the prototype's flat `state` object
   ================================================================ */
interface PostStore {
  /* ---- UI state ---- */
  sidebarOpen: boolean;

  /* ---- Post state ---- */
  postTitle: string;
  slides: Slide[];
  selectedSlideId: number | null;
  nextSlideId: number;

  /* ---- Computed (functions so Zustand doesn't need selectors) ---- */
  currentSlide: () => Slide | null;
  hasImage: () => boolean;

  /* ---- Actions ---- */
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  selectSlide: (id: number) => void;
  addSlide: () => void;
  deleteSlide: (id: number) => void;
  reorderSlides: (ids: number[]) => void;

  updateTitle: (title: string) => void;

  addTag: (handle: string, isLink: boolean) => void;
  removeTag: (handle: string) => void;

  setSlideImage: (src: string) => void;
}

/* ================================================================
   STORE
   ================================================================ */
export const usePostStore = create<PostStore>((set, get) => ({
  /* ---- defaults ---- */
  sidebarOpen: true,
  postTitle: 'Untitled post',
  slides: [{ id: 1, src: null, tags: [] }],
  selectedSlideId: 1,
  nextSlideId: 2,

  /* ---- computed ---- */
  currentSlide: () => {
    const { slides, selectedSlideId } = get();
    return slides.find(s => s.id === selectedSlideId) ?? null;
  },
  hasImage: () => {
    const slide = get().currentSlide();
    return !!(slide && slide.src);
  },

  /* ---- sidebar ---- */
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  /* ---- slides ---- */
  selectSlide: (id) => set({ selectedSlideId: id }),

  addSlide: () =>
    set(s => {
      const id = s.nextSlideId;
      return {
        slides: [...s.slides, { id, src: null, tags: [] }],
        selectedSlideId: id,
        nextSlideId: id + 1,
      };
    }),

  deleteSlide: (id) =>
    set(s => {
      const idx = s.slides.findIndex(sl => sl.id === id);
      if (idx === -1) return s;
      const next = s.slides.filter(sl => sl.id !== id);
      const selectedSlideId =
        next.length > 0
          ? (next[Math.min(idx, next.length - 1)]?.id ?? null)
          : null;
      return { slides: next, selectedSlideId };
    }),

  reorderSlides: (ids) =>
    set(s => ({
      slides: ids
        .map(id => s.slides.find(sl => sl.id === id))
        .filter((sl): sl is Slide => sl !== undefined),
    })),

  /* ---- post ---- */
  updateTitle: (title) => set({ postTitle: title || 'Untitled post' }),

  /* ---- tags ---- */
  addTag: (handle, isLink) =>
    set(s => {
      const slide = s.currentSlide();
      if (!slide) return s;
      if (slide.tags.some(t => t.handle === handle)) return s;
      const tag: Tag = { handle, isLink };
      return {
        slides: s.slides.map(sl =>
          sl.id === slide.id ? { ...sl, tags: [...sl.tags, tag] } : sl,
        ),
      };
    }),

  removeTag: (handle) =>
    set(s => {
      const slide = s.currentSlide();
      if (!slide) return s;
      return {
        slides: s.slides.map(sl =>
          sl.id === slide.id
            ? { ...sl, tags: sl.tags.filter(t => t.handle !== handle) }
            : sl,
        ),
      };
    }),

  /* ---- image ---- */
  setSlideImage: (src) =>
    set(s => {
      const slide = s.currentSlide();
      if (!slide) return s;
      return {
        slides: s.slides.map(sl =>
          sl.id === slide.id ? { ...sl, src } : sl,
        ),
      };
    }),
}));
