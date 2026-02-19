import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CirclePlus } from 'lucide-react';
import { usePostStore } from '../../store/usePostStore';
import { SlideThumb } from './SlideThumb';
import styles from './SlideGallery.module.css';

export function SlideGallery() {
  const slides          = usePostStore(s => s.slides);
  const selectedSlideId = usePostStore(s => s.selectedSlideId);
  const selectSlide     = usePostStore(s => s.selectSlide);
  const addSlide        = usePostStore(s => s.addSlide);
  const deleteSlide     = usePostStore(s => s.deleteSlide);
  const reorderSlides   = usePostStore(s => s.reorderSlides);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = slides.findIndex(s => s.id === active.id);
    const newIndex = slides.findIndex(s => s.id === over.id);
    const reordered = arrayMove(slides, oldIndex, newIndex);
    reorderSlides(reordered.map(s => s.id));
  }

  return (
    <section className={styles.gallery} aria-label="Slide gallery">
      <div className={styles.track}>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map(s => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={styles.slides} role="list" aria-label="Slides">
              {slides.map(slide => (
                <SlideThumb
                  key={slide.id}
                  slide={slide}
                  isSelected={slide.id === selectedSlideId}
                  showDelete={slides.length > 1}
                  onSelect={() => selectSlide(slide.id)}
                  onDelete={e => { e.stopPropagation(); deleteSlide(slide.id); }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add slide — outside DnD context so it's never draggable */}
        <div
          className={`${styles.thumb} ${styles.thumbAdd}`}
          role="button"
          tabIndex={0}
          aria-label="Add new slide"
          onClick={addSlide}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') addSlide(); }}
        >
          <span className={styles.thumbIcon}>
            <CirclePlus size={32} color="var(--slate-400)" />
          </span>
        </div>

      </div>
    </section>
  );
}
