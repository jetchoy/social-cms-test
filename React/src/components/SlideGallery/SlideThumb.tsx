import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Image, X } from 'lucide-react';
import type { Slide } from '../../types';
import styles from './SlideGallery.module.css';

interface Props {
  slide: Slide;
  isSelected: boolean;
  showDelete: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function SlideThumb({ slide, isSelected, showDelete, onSelect, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cls = [
    styles.thumb,
    slide.src ? '' : styles.thumbEmpty,
    isSelected ? styles.isSelected : '',
    isDragging ? styles.isDragging : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cls}
      aria-label={`Slide ${slide.id}${slide.src ? '' : ' (empty)'}`}
      onClick={onSelect}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
      {...attributes}
      {...listeners}
    >
      {slide.src ? (
        <img className={styles.thumbImg} src={slide.src} alt="" />
      ) : (
        <span className={styles.thumbIcon}><Image size={32} color="var(--slate-400)" /></span>
      )}

      {isSelected && showDelete && (
        <button
          className={styles.deleteBtn}
          aria-label="Delete slide"
          onClick={onDelete}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
