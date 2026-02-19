/**
 * LARAVEL API MOCK LAYER
 * ======================
 * Every function below is a stub for a real Laravel endpoint.
 * Engineers replace the mock body with an axios call.
 *
 * Pattern:
 *   1. Comment shows the HTTP verb + route + payload shape
 *   2. Mock body returns a plausible in-memory value
 *   3. Real axios call is commented out beneath the TODO
 *
 * Install axios:  npm install axios
 * Add base URL:   axios.defaults.baseURL = import.meta.env.VITE_API_URL;
 */

// import axios from 'axios';
import type { Post, Tag } from '../types';

/* ------------------------------------------------------------------ */
/*  POST                                                                */
/* ------------------------------------------------------------------ */

/**
 * Create a new post (called when the user first lands on Create Post).
 * TODO: POST /api/posts
 * Payload:  { title: string }
 * Response: { id: number, title: string, status: 'draft' }
 */
export async function createPost(title: string): Promise<{ id: number }> {
  // TODO: return (await axios.post('/api/posts', { title })).data;
  console.log('[mock] createPost', title);
  return { id: Math.floor(Math.random() * 10_000) };
}

/**
 * Persist post metadata (title, status).
 * TODO: PATCH /api/posts/:id
 * Payload:  { title?: string; status?: 'draft' | 'scheduled' | 'published' }
 * Response: Post
 */
export async function updatePost(
  postId: number,
  payload: Partial<Pick<Post, 'title' | 'status'>>,
): Promise<void> {
  // TODO: await axios.patch(`/api/posts/${postId}`, payload);
  console.log('[mock] updatePost', postId, payload);
}

/**
 * Permanently delete a post and all its slides.
 * TODO: DELETE /api/posts/:id
 * Response: 204 No Content
 */
export async function deletePost(postId: number): Promise<void> {
  // TODO: await axios.delete(`/api/posts/${postId}`);
  console.log('[mock] deletePost', postId);
}

/* ------------------------------------------------------------------ */
/*  SLIDES                                                              */
/* ------------------------------------------------------------------ */

/**
 * Add a new empty slide to a post.
 * TODO: POST /api/posts/:postId/slides
 * Payload:  { position: number }
 * Response: { id: number }
 */
export async function createSlide(postId: number, position: number): Promise<{ id: number }> {
  // TODO: return (await axios.post(`/api/posts/${postId}/slides`, { position })).data;
  console.log('[mock] createSlide', postId, position);
  return { id: Math.floor(Math.random() * 10_000) };
}

/**
 * Delete a single slide.
 * TODO: DELETE /api/slides/:id
 * Response: 204 No Content
 */
export async function deleteSlide(slideId: number): Promise<void> {
  // TODO: await axios.delete(`/api/slides/${slideId}`);
  console.log('[mock] deleteSlide', slideId);
}

/**
 * Reorder slides within a post.
 * TODO: PATCH /api/posts/:postId/slides/reorder
 * Payload:  { ids: number[] }   — ordered array of slide IDs
 * Response: 200 OK
 */
export async function reorderSlides(postId: number, ids: number[]): Promise<void> {
  // TODO: await axios.patch(`/api/posts/${postId}/slides/reorder`, { ids });
  console.log('[mock] reorderSlides', postId, ids);
}

/**
 * Upload the cropped / edited image for a slide.
 * TODO: POST /api/slides/:id/media  (multipart/form-data)
 * Payload:  FormData with key "file" → File | Blob
 * Response: { url: string }   — CDN URL to store as slide.src
 *
 * In the prototype we keep the JPEG data URL locally.
 * In production, replace with:
 *   const formData = new FormData();
 *   formData.append('file', file);
 *   return (await axios.post(`/api/slides/${slideId}/media`, formData)).data;
 */
export async function uploadSlideMedia(
  slideId: number,
  file: File | Blob,
): Promise<{ url: string }> {
  // TODO: POST /api/slides/:id/media  (multipart/form-data)
  // const formData = new FormData();
  // formData.append('file', file);
  // return (await axios.post(`/api/slides/${slideId}/media`, formData)).data;

  console.log('[mock] uploadSlideMedia', slideId);
  return { url: URL.createObjectURL(file) };
}

/* ------------------------------------------------------------------ */
/*  TAGS                                                                */
/* ------------------------------------------------------------------ */

/**
 * Replace the tags array for a slide.
 * TODO: PATCH /api/slides/:id
 * Payload:  { tags: { handle: string; isLink: boolean }[] }
 * Response: Slide
 */
export async function updateSlideTags(slideId: number, tags: Tag[]): Promise<void> {
  // TODO: await axios.patch(`/api/slides/${slideId}`, { tags });
  console.log('[mock] updateSlideTags', slideId, tags);
}

/* ------------------------------------------------------------------ */
/*  DRAFT RESTORE                                                       */
/* ------------------------------------------------------------------ */

/**
 * Load an existing post (used on Edit Post route).
 * TODO: GET /api/posts/:id
 * Response: Post (with slides + tags hydrated)
 */
export async function fetchPost(postId: number): Promise<Post> {
  // TODO: return (await axios.get(`/api/posts/${postId}`)).data;
  console.log('[mock] fetchPost', postId);
  return {
    id: postId,
    title: 'Untitled post',
    status: 'draft',
    slides: [{ id: 1, src: null, tags: [] }],
  };
}
