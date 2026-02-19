import { X } from 'lucide-react';
import type { Tag } from '../../types';
import styles from './SlideDetails.module.css';

interface Props {
  tags: Tag[];
  onRemove: (handle: string) => void;
}

export function TagList({ tags, onRemove }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className={styles.tags} role="list" aria-label="Tagged users">
      {tags.map(tag => (
        <div
          key={tag.handle}
          className={`${styles.tag}${tag.isLink ? ` ${styles.isLink}` : ''}`}
          role="listitem"
          title={tag.isLink ? `Open @${tag.handle} on Instagram` : undefined}
          onClick={e => {
            if ((e.target as HTMLElement).closest(`.${styles.tagRemove}`)) return;
            if (tag.isLink) {
              window.open(`https://www.instagram.com/${tag.handle}/`, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <span>{tag.handle}</span>
          <button
            className={styles.tagRemove}
            aria-label={`Remove @${tag.handle}`}
            onClick={e => { e.stopPropagation(); onRemove(tag.handle); }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
