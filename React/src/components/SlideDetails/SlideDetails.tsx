import { useRef } from 'react';
import { Image, Palette, WandSparkles } from 'lucide-react';
import { usePostStore } from '../../store/usePostStore';
import { useTags } from '../../hooks/useTags';
import { TagList } from './TagList';
import styles from './SlideDetails.module.css';

interface Props {
  detailsWidth: number | undefined;
  onBrowse: () => void;
  onOpenImageEditor: () => void;
}

export function SlideDetails({ detailsWidth, onBrowse, onOpenImageEditor }: Props) {
  const currentSlide = usePostStore(s => s.currentSlide());
  const addTag       = usePostStore(s => s.addTag);
  const removeTag    = usePostStore(s => s.removeTag);
  const hasImage     = !!(currentSlide?.src);

  const { tagError, showTagError, clearTagError, parseHandle } = useTags();
  const tagInputRef = useRef<HTMLInputElement>(null);

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const raw = tagInputRef.current!.value.trim();
    if (!raw) return;
    const result = parseHandle(raw);
    if (!result) return;
    if ('error' in result) { showTagError('Invalid Instagram profile link'); return; }
    clearTagError();
    addTag(result.handle, result.isLink);
    tagInputRef.current!.value = '';
  }

  const inlineWidth = detailsWidth !== undefined ? { width: detailsWidth } : undefined;

  return (
    <div className={styles.details} style={inlineWidth}>

      {/* Image / video */}
      <div className="field-group">
        <label className="field-label">Image / video</label>
        <button className="btn btn--primary btn--full" onClick={onBrowse}>
          <Image size={16} />
          Browse
        </button>
      </div>

      {/* Edit */}
      <div className="field-group">
        <label className="field-label">Edit</label>
        <button
          className="btn btn--secondary btn--full"
          disabled={!hasImage}
          onClick={onOpenImageEditor}
        >
          <Palette size={16} />
          Image editor
        </button>
        <button
          className="btn btn--secondary btn--full"
          disabled={!hasImage}
          onClick={() => alert('AI editor coming soon.')}
        >
          <WandSparkles size={16} />
          AI editor
        </button>
      </div>

      {/* Tag users */}
      <div className="field-group">
        <label className="field-label" htmlFor="tag-input">Tag users</label>
        <input
          ref={tagInputRef}
          id="tag-input"
          type="text"
          className={`text-input${tagError ? ' is-invalid' : ''}`}
          placeholder="Paste Instagram profile link"
          autoComplete="off"
          spellCheck={false}
          disabled={!hasImage}
          aria-describedby="tag-input-error"
          onKeyDown={handleTagKeyDown}
          onChange={clearTagError}
        />
        {tagError && (
          <p id="tag-input-error" className="field-error" role="alert">
            {tagError}
          </p>
        )}
        <TagList
          tags={currentSlide?.tags ?? []}
          onRemove={removeTag}
        />
      </div>

    </div>
  );
}
