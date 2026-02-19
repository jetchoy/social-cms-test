/* ================================================================
   DOMAIN TYPES
   These mirror the Laravel Eloquent models and API payload shapes.
   ================================================================ */

export interface Tag {
  /** Instagram handle without the @ prefix */
  handle: string;
  /** true when the tag was added via an Instagram URL */
  isLink: boolean;
}

export interface Slide {
  /** Laravel: slides.id (primary key) */
  id: number;
  /**
   * Prototype: JPEG data URL produced by Cropper.js / Filerobot
   * Production: CDN URL returned by POST /api/slides/:id/media
   */
  src: string | null;
  tags: Tag[];
}

export interface Post {
  /** Laravel: posts.id (primary key) */
  id: number | null;
  title: string;
  slides: Slide[];
  /** Laravel: posts.status — 'draft' | 'scheduled' | 'published' */
  status: 'draft' | 'scheduled' | 'published';
}
