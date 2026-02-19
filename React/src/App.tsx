import { useRef, useState, useEffect } from 'react';
import { AppSidebar } from './components/AppSidebar/AppSidebar';
import { CreatePostHeader } from './components/CreatePostHeader/CreatePostHeader';
import { SlideGallery } from './components/SlideGallery/SlideGallery';
import { SlideCanvas } from './components/SlideCanvas/SlideCanvas';
import { SlideDetails } from './components/SlideDetails/SlideDetails';
import { CropModal } from './components/CropModal/CropModal';
import { ImageEditorModal } from './components/ImageEditorModal/ImageEditorModal';
import { CreatePostFooter } from './components/CreatePostFooter/CreatePostFooter';
import { useCanvasResize } from './hooks/useCanvasResize';
import { usePostStore } from './store/usePostStore';
import { usePersistedDraft } from './hooks/usePersistedDraft';
import { validateFile } from './utils/fileValidation';
import styles from './App.module.css';

export default function App() {
  /* Persist draft to / restore from localStorage */
  usePersistedDraft();

  const setSlideImage = usePostStore(s => s.setSlideImage);
  const currentSlide  = usePostStore(s => s.currentSlide());

  /* Canvas sizing */
  const editorRef = useRef<HTMLElement>(null);
  const { canvasWidth, detailsWidth, isStacked } = useCanvasResize(
    editorRef as React.RefObject<HTMLElement | null>
  );

  /* Crop modal */
  const [cropSrc, setCropSrc]     = useState<string | null>(null);
  const cropObjectUrlRef          = useRef<string | null>(null);

  /* Image editor modal */
  const [editorSrc, setEditorSrc] = useState<string | null>(null);

  /* ---- Escape key handler ---- */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (editorSrc) { setEditorSrc(null); return; }
      if (cropSrc)   { closeCropModal(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropSrc, editorSrc]);

  /* ---- File picked → open crop modal ---- */
  function handleFileSelected(file: File) {
    const v = validateFile(file);
    if (!v.ok) { alert(v.error); return; }
    if (cropObjectUrlRef.current) URL.revokeObjectURL(cropObjectUrlRef.current);
    const url = URL.createObjectURL(file);
    cropObjectUrlRef.current = url;
    setCropSrc(url);
  }

  /* ---- Crop applied ---- */
  function handleCropApply(dataUrl: string) {
    setSlideImage(dataUrl);
    closeCropModal();
  }

  function closeCropModal() {
    if (cropObjectUrlRef.current) {
      URL.revokeObjectURL(cropObjectUrlRef.current);
      cropObjectUrlRef.current = null;
    }
    setCropSrc(null);
  }

  /* ---- Image editor ---- */
  function openImageEditor() {
    if (!currentSlide?.src) return;
    setEditorSrc(currentSlide.src);
  }

  function handleEditorSave(dataUrl: string) {
    setSlideImage(dataUrl);
    setEditorSrc(null);
  }

  return (
    <div className={styles.app}>
      <AppSidebar />

      <main className={styles.main}>
        <div className={styles.card}>
          <CreatePostHeader />
          <SlideGallery />

          <section
            ref={editorRef as React.RefObject<HTMLElement>}
            className={`${styles.editor}${isStacked ? ` ${styles.isStacked}` : ''}`}
            aria-label="Slide editor"
          >
            <SlideCanvas
              width={canvasWidth}
              onFileSelected={handleFileSelected}
            />
            <SlideDetails
              detailsWidth={detailsWidth}
              onBrowse={() => {
                // Programmatically trigger the hidden file input inside SlideCanvas
                // by dispatching a click on the nearest canvas browse button
                document.querySelector<HTMLButtonElement>('[data-canvas-browse]')?.click();
              }}
              onOpenImageEditor={openImageEditor}
            />
          </section>

          <CreatePostFooter />
        </div>
      </main>

      {cropSrc && (
        <CropModal
          src={cropSrc}
          onApply={handleCropApply}
          onClose={closeCropModal}
        />
      )}
      {editorSrc && (
        <ImageEditorModal
          src={editorSrc}
          onSave={handleEditorSave}
          onClose={() => setEditorSrc(null)}
        />
      )}
    </div>
  );
}
