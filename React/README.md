# Tatler Social CMS — Create Post (React)

A TypeScript rewrite of `create-post.html` using React 18 + Vite. Every feature from the prototype works: image upload, crop modal, image editor, tag users, drag-to-reorder slides, responsive layout, and localStorage draft persistence.

This folder is a **reference implementation and Laravel integration handoff** — it is not a production app. The single-file prototype in the repo root remains the source of truth for design decisions.

---

## Running locally

```bash
cd React
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Vite's dev server has hot-module reload.

---

## Connecting to Laravel

All backend calls are stubbed in one file: **`src/api/mock.ts`**

Each function has the real HTTP verb, route, and payload shape commented out. To wire up an endpoint, install axios and replace the mock body:

```ts
// src/api/mock.ts — before
export async function uploadSlideMedia(slideId: number, file: File): Promise<{ url: string }> {
  // TODO: POST /api/slides/:id/media  (multipart/form-data)
  return { url: URL.createObjectURL(file) };
}

// after
import axios from 'axios';

export async function uploadSlideMedia(slideId: number, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return (await axios.post(`/api/slides/${slideId}/media`, formData)).data;
}
```

### All 8 endpoints

| Function | Method | Route |
|---|---|---|
| `createPost` | `POST` | `/api/posts` |
| `updatePost` | `PATCH` | `/api/posts/:id` |
| `deletePost` | `DELETE` | `/api/posts/:id` |
| `createSlide` | `POST` | `/api/posts/:id/slides` |
| `deleteSlide` | `DELETE` | `/api/slides/:id` |
| `reorderSlides` | `PATCH` | `/api/posts/:id/slides/reorder` |
| `uploadSlideMedia` | `POST` | `/api/slides/:id/media` |
| `updateSlideTags` | `PATCH` | `/api/slides/:id` |

Set your API base URL once:

```ts
// src/api/mock.ts (top of file)
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
```

```bash
# .env.local
VITE_API_URL=http://localhost:8000
```

---

## Project structure

```
src/
├── main.tsx                        Entry point
├── App.tsx                         Root — wires modals, canvas sizing, file flow
│
├── types/index.ts                  Tag, Slide, Post interfaces (match Laravel models)
│
├── api/mock.ts                     All 8 Laravel endpoints stubbed — start here
│
├── store/usePostStore.ts           Zustand store (mirrors prototype state shape)
│
├── hooks/
│   ├── useCanvasResize.ts          ResizeObserver: 4:5 aspect ratio + stacked layout
│   ├── useCropper.ts               Cropper.js lifecycle
│   ├── useImageEditor.ts           Filerobot Image Editor lifecycle
│   ├── useTags.ts                  parseHandle — URL / @handle / bare handle
│   └── usePersistedDraft.ts        localStorage save / restore
│
├── utils/fileValidation.ts         MAX_FILE_BYTES, ALLOWED_TYPES, validateFile
│
├── styles/
│   ├── tokens.css                  CSS variables (ported 1:1 from prototype)
│   └── globals.css                 Reset, base, shared button/field/modal styles
│
└── components/
    ├── AppSidebar/                 Collapsible nav; mobile drawer
    ├── CreatePostHeader/           Breadcrumb + inline post title edit
    ├── SlideGallery/               Drag-to-reorder thumbnails (@dnd-kit)
    ├── SlideCanvas/                Image preview + drag-and-drop upload
    ├── SlideDetails/               Browse, image editor, tag input
    ├── CropModal/                  Cropper.js — locked 4:5 ratio
    ├── ImageEditorModal/           Filerobot Image Editor
    └── CreatePostFooter/           Discard / Done editing
```

---

## Tech choices

| Concern | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Standard modern SPA setup |
| Language | TypeScript | Self-documenting; engineers see exact API payload types |
| State | Zustand | Direct equivalent of the prototype's flat `state` object |
| Styling | CSS Modules + design tokens | Prototype's CSS variables ported as-is |
| Icons | `lucide-react` | Drop-in replacement for Lucide CDN |
| Drag-and-drop | `@dnd-kit/core` | Best-maintained React DnD library |
| Cropper | `cropperjs@1.6.2` | Same version as prototype |
| Image editor | `filerobot-image-editor@4.8.1` | Same library, same config, pinned version |
| Font | `@fontsource/geist` | Local import replaces Google Fonts CDN |

---

## Building for production

```bash
npm run build   # outputs to dist/
```

TypeScript is checked as part of the build — it will fail on type errors.

> **Note:** if deploying to a subdirectory (e.g. GitHub Pages), set `base` in `vite.config.ts`:
> ```ts
> export default defineConfig({ base: '/your-repo-name/', ... })
> ```
