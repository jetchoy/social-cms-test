import { useState, useCallback } from 'react';

interface ParsedHandle {
  handle: string;
  isLink: boolean;
  error?: never;
}
interface ParseError {
  error: true;
  handle?: never;
  isLink?: never;
}
type ParseResult = ParsedHandle | ParseError | null;

/**
 * Parses a raw user input string into a tag handle.
 *
 * Accepts:
 *  - Full Instagram URL: https://www.instagram.com/username/
 *  - @handle
 *  - bare handle
 *
 * Returns null when input is empty after stripping.
 * Returns { error: true } when the input looks like a URL but is not a valid Instagram profile.
 */
export function parseHandle(input: string): ParseResult {
  const urlMatch = input.match(/instagram\.com\/([a-zA-Z0-9._]+)\/?$/);
  if (urlMatch) return { handle: urlMatch[1], isLink: true };

  if (/https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,}/i.test(input)) {
    return { error: true };
  }

  const handle = input.replace(/^@/, '').trim();
  return handle ? { handle, isLink: false } : null;
}

interface UseTagsReturn {
  tagError: string;
  showTagError: (msg: string) => void;
  clearTagError: () => void;
  parseHandle: typeof parseHandle;
}

export function useTags(): UseTagsReturn {
  const [tagError, setTagError] = useState('');

  const showTagError = useCallback((msg: string) => setTagError(msg), []);
  const clearTagError = useCallback(() => setTagError(''), []);

  return { tagError, showTagError, clearTagError, parseHandle };
}
