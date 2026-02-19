import { useRef, useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { usePostStore } from '../../store/usePostStore';
import { validateFile } from '../../utils/fileValidation';
import styles from './SlideCanvas.module.css';

interface Props {
  width: number;
  onFileSelected: (file: File) => void;
}

export function SlideCanvas({ width, onFileSelected }: Props) {
  const currentSlide = usePostStore(s => s.currentSlide());
  const hasImage     = !!(currentSlide?.src);

  const fileInputRef    = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function pickFile() { fileInputRef.current?.click(); }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const v = validateFile(file);
      if (!v.ok) { alert(v.error); return; }
      onFileSelected(file);
    }
    e.target.value = '';
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    const el = e.currentTarget as HTMLElement;
    if (!el.contains(e.relatedTarget as Node)) setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const v = validateFile(file);
      if (!v.ok) { alert(v.error); return; }
      onFileSelected(file);
    }
  }

  const cls = [
    styles.canvas,
    hasImage   ? styles.hasImage   : '',
    isDragOver ? styles.isDragOver : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        className={cls}
        style={{ width, maxWidth: width }}
        role="region"
        aria-label="Slide canvas"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Empty state */}
        <div className={styles.empty}>
          <span className={styles.uploadIcon} aria-hidden="true">
            <Upload size={48} color="var(--slate-400)" />
          </span>
          <div className={styles.copy}>
            <h4>Drag and drop file here</h4>
            <p>jpg, png, gif, svg, webp, heic (max. 50MB)</p>
          </div>
          <span className={styles.orLabel} aria-hidden="true">OR</span>
          <button className="btn btn--primary" data-canvas-browse onClick={pickFile}>
            <Image size={16} />
            Browse
          </button>
        </div>

        {/* Image */}
        {hasImage && (
          <img
            className={styles.image}
            src={currentSlide!.src!}
            alt="Current slide content"
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/svg+xml,image/webp,image/heic,image/heif"
        aria-hidden="true"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}
