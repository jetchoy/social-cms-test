import { useState, useRef, useEffect } from 'react';
import { PanelLeft, ChevronRight, Pen } from 'lucide-react';
import { usePostStore } from '../../store/usePostStore';
import styles from './CreatePostHeader.module.css';

export function CreatePostHeader() {
  const postTitle     = usePostStore(s => s.postTitle);
  const updateTitle   = usePostStore(s => s.updateTitle);
  const toggleSidebar = usePostStore(s => s.toggleSidebar);
  const sidebarOpen   = usePostStore(s => s.sidebarOpen);

  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState(postTitle);
  const inputRef                = useRef<HTMLInputElement>(null);

  // Keep draft in sync if external title changes (e.g. loaded from storage)
  useEffect(() => {
    if (!editing) setDraft(postTitle);
  }, [postTitle, editing]);

  function beginEdit() {
    setDraft(postTitle);
    setEditing(true);
    setTimeout(() => { inputRef.current?.select(); }, 0);
  }

  function commitEdit() {
    updateTitle(draft.trim());
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(postTitle);
    setEditing(false);
  }

  return (
    <header className={styles.header}>

      <button
        className={styles.toggle}
        aria-label="Toggle navigation sidebar"
        aria-expanded={sidebarOpen}
        onClick={toggleSidebar}
      >
        <PanelLeft size={16} />
      </button>

      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <span className={styles.section}>Create post</span>
        <span className={styles.sep} aria-hidden="true">
          <ChevronRight size={16} />
        </span>

        <div className={styles.titleWrap}>
          {editing ? (
            <input
              ref={inputRef}
              className={styles.titleInput}
              type="text"
              value={draft}
              maxLength={120}
              aria-label="Post title"
              onChange={e => setDraft(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => {
                if (e.key === 'Enter')  { e.preventDefault(); commitEdit(); }
                if (e.key === 'Escape') cancelEdit();
              }}
            />
          ) : (
            <>
              <span
                className={styles.titleDisplay}
                role="button"
                tabIndex={0}
                title="Click to rename"
                aria-label="Post title — click to edit"
                onClick={beginEdit}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') beginEdit(); }}
              >
                {postTitle}
              </span>
              <button
                className={styles.editBtn}
                aria-label="Edit post title"
                onClick={beginEdit}
              >
                <Pen size={12} />
              </button>
            </>
          )}
        </div>
      </nav>

    </header>
  );
}
