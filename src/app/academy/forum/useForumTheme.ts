import { useState, useEffect } from 'react';
import { FORUM_COLORS, type ForumColorId, type ForumMode, resolveTheme } from './themes';

const COLOR_KEY = 'forum-color';
const MODE_KEY = 'forum-mode';

export function useForumTheme() {
  const [colorId, setColorId] = useState<ForumColorId>('lavender');
  const [mode, setMode] = useState<ForumMode>('light');

  useEffect(() => {
    const savedColor = localStorage.getItem(COLOR_KEY);
    const savedMode = localStorage.getItem(MODE_KEY);
    if (savedColor && FORUM_COLORS.some((c) => c.id === savedColor)) {
      setColorId(savedColor as ForumColorId);
    }
    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
    // Remove blocking style tag once React has taken over
    const injected = document.querySelector('style[data-forum-theme]');
    if (injected) injected.remove();
  }, []);

  const setColor = (id: ForumColorId) => {
    setColorId(id);
    localStorage.setItem(COLOR_KEY, id);
  };

  const setThemeMode = (m: ForumMode) => {
    setMode(m);
    localStorage.setItem(MODE_KEY, m);
  };

  const theme = resolveTheme(colorId, mode);

  // Backward compat
  const themeId = theme.id;
  const setTheme = (id: string) => {
    // Parse "color-mode" format
    const parts = id.split('-');
    const m = parts.pop() as ForumMode;
    const c = parts.join('-') as ForumColorId;
    if (m === 'light' || m === 'dark') {
      setColor(c);
      setThemeMode(m);
    }
  };

  return { theme, themeId, colorId, mode, setColor, setThemeMode, setTheme };
}
