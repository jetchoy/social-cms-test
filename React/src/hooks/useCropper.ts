import { useRef, useState, useCallback } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface UseCropperReturn {
  isOpen: boolean;
  cropSrc: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  open: (src: string) => void;
  close: () => void;
  apply: () => string | null;
}

/**
 * Manages a Cropper.js instance lifecycle: open, close, apply.
 * The caller is responsible for revoking any object URL passed to open().
 */
export function useCropper(): UseCropperReturn {
  const [isOpen, setIsOpen]   = useState(false);
  const [cropSrc, setCropSrc] = useState('');
  const imgRef                = useRef<HTMLImageElement | null>(null);
  const cropperRef            = useRef<Cropper | null>(null);

  const open = useCallback((src: string) => {
    setCropSrc(src);
    setIsOpen(true);
  }, []);

  const destroyCropper = useCallback(() => {
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    destroyCropper();
    // Revoke object URL if one was used
    if (cropSrc.startsWith('blob:')) URL.revokeObjectURL(cropSrc);
    setCropSrc('');
    setIsOpen(false);
  }, [destroyCropper, cropSrc]);

  /**
   * Called once the <img> element is in the DOM (via onLoad).
   * Initialises the Cropper.js instance.
   */
  const initCropper = useCallback(() => {
    if (!imgRef.current) return;
    destroyCropper();
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
  }, [destroyCropper]);

  /**
   * Exports the cropped canvas as a JPEG data URL at 540×675 px.
   * Returns null if no cropper is active.
   */
  const apply = useCallback((): string | null => {
    if (!cropperRef.current) return null;
    const canvas = cropperRef.current.getCroppedCanvas({
      width: 540,
      height: 675,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  // Expose initCropper so the component can call it via onLoad
  (imgRef as React.RefObject<HTMLImageElement | null> & { onImageLoad?: () => void }).onImageLoad = initCropper;

  return { isOpen, cropSrc, imgRef, open, close, apply };
}
