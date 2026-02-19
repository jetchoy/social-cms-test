import { useRef, useEffect, useCallback } from 'react';
import Cropper from 'cropperjs';
import { X, Crop } from 'lucide-react';
import 'cropperjs/dist/cropper.css';
import styles from './CropModal.module.css';

interface Props {
  src: string;
  onApply: (dataUrl: string) => void;
  onClose: () => void;
}

export function CropModal({ src, onApply, onClose }: Props) {
  const imgRef     = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const initCropper = useCallback(() => {
    if (!imgRef.current) return;
    if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    cropperRef.current = new Cropper(imgRef.current, {
      aspectRatio: 4 / 5,
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 0.95,
      restore: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      background: false,
    });
  }, []);

  // Destroy on unmount
  useEffect(() => {
    return () => {
      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }
    };
  }, []);

  function handleApply() {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCroppedCanvas({
      width: 540,
      height: 675,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    onApply(canvas.toDataURL('image/jpeg', 0.92));
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      onClick={handleBackdropClick}
    >
      <div className="modal">

        <div className="modal__header">
          <h2 className="modal__title" id="crop-modal-title">Crop image</h2>
          <button className="icon-btn" aria-label="Cancel crop" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal__body">
          <img
            ref={imgRef}
            className={styles.cropImg}
            src={src}
            alt="Image to crop"
            onLoad={initCropper}
          />
        </div>

        <div className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleApply}>
            <Crop size={16} />
            Crop &amp; apply
          </button>
        </div>

      </div>
    </div>
  );
}
