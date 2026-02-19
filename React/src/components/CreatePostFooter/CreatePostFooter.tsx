import { Trash, Check } from 'lucide-react';
import { usePostStore } from '../../store/usePostStore';
import { clearPersistedDraft } from '../../hooks/usePersistedDraft';
import styles from './CreatePostFooter.module.css';

export function CreatePostFooter() {
  const postTitle = usePostStore(s => s.postTitle);

  function handleDiscard() {
    if (!window.confirm('Discard all changes to this post?')) return;
    clearPersistedDraft();
    window.location.reload();
  }

  function handleDone() {
    alert(`"${postTitle}" saved as draft.\n\nProduction: PATCH /api/posts/:id`);
  }

  return (
    <footer className={styles.footer}>
      <button className="btn btn--secondary" onClick={handleDiscard}>
        <Trash size={16} />
        Discard
      </button>
      <button className="btn btn--primary" onClick={handleDone}>
        <Check size={16} />
        Done editing
      </button>
    </footer>
  );
}
