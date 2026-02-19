# Tatler Social CMS — Create Post (Prototype)

A pixel-perfect, single-file HTML/CSS/JS prototype of the **Create Post** screen for the Tatler Social CMS. Built for design validation and as a blueprint for the Vue/Laravel production implementation.

## Running it

No build step or server required. Open `create-post.html` directly in a browser:

```
open create-post.html
```

Draft state (title, slides, tags, sidebar position) is automatically saved to `localStorage` and restored on reload. Use the **Discard** button to reset.

## What's included

| Feature | Notes |
|---|---|
| Slide gallery | Add, delete, reorder via drag-and-drop (SortableJS) |
| Image upload | Browse or drag-and-drop onto the canvas. Validates type and size (max 50 MB) |
| Crop modal | Locked to 4:5 aspect ratio (Cropper.js) |
| Image editor | Full editing tools — adjust, filters, annotate, resize (Filerobot Image Editor) |
| Tag users | Accepts `@handle` or an Instagram profile URL; renders as clickable chips |
| Responsive | Stacks to a single column below 792 px; mobile-optimised below 768 px |
| Draft persistence | Saves to `localStorage` on every change; survives page refresh |

## Libraries (all via CDN)

| Library | Version | Purpose |
|---|---|---|
| [Lucide](https://lucide.dev) | latest | Icons |
| [SortableJS](https://sortablejs.github.io/Sortable/) | 1.15.3 | Drag-and-drop slide reordering |
| [Cropper.js](https://fengyuanchen.github.io/cropperjs/) | 1.6.2 | 4:5 crop modal |
| [Filerobot Image Editor](https://github.com/scaleflex/filerobot-image-editor) | latest (v4) | Full image editing |
| [Geist](https://fonts.google.com/specimen/Geist) | — | Font (Google Fonts) |

> **Production note:** pin Filerobot to a specific version via jsDelivr:
> `https://cdn.jsdelivr.net/npm/filerobot-image-editor@4.8.1/dist/filerobot-image-editor.min.js`

## Assets

```
assets/
  tatler-logo-full.png   Sidebar logo (expanded state)
  tatler-logo-icon.png   Sidebar logo (collapsed state)
```

Both `<img>` elements have `onerror` text fallbacks so the UI remains functional if assets are missing.

## Production migration

The file is annotated throughout with migration hints:

- **CSS** — design tokens map directly to a `tailwind.config.js` theme or a shared `tokens.css`
- **Components** — each section is marked `@vue-component` with `@props` and `@emits`
- **API calls** — each action is marked `@laravel:` with the expected HTTP method and endpoint

The intended production stack is **Vue 3** (Composition API) + **Laravel** API backend. Images should be uploaded to a server and stored as CDN URLs rather than the Base64 data URLs used here.
