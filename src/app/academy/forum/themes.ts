export type ForumColorId =
  | 'lavender'
  | 'lime'
  | 'mint'
  | 'soft-purple'
  | 'chartreuse'
  | 'beige'
  | 'pink'
  | 'sky-blue'
  | 'cream'
  | 'orange'
  | 'yellow'
  | 'grey';

export type ForumMode = 'light' | 'dark';

export interface ForumColorDef {
  id: ForumColorId;
  label: string;
  swatch: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

// Keep old type alias for compatibility
export type ForumThemeId = string;

export interface ForumTheme {
  id: string;
  label: string;
  swatch: string;
  vars: Record<string, string>;
}

/* ── Shared bases — matches profile design language ── */

const DARK_BASE: Record<string, string> = {
  '--forum-bg': '#000',
  '--forum-surface': '#121212',
  '--forum-border': 'rgba(255,255,255,0.35)',
  '--forum-border-subtle': 'rgba(255,255,255,0.04)',
  '--forum-text': '#fff',
  '--forum-text-secondary': 'rgba(255,255,255,0.7)',
  '--forum-text-muted': 'rgba(255,255,255,0.45)',
  '--forum-downvote': '#f87171',
  '--forum-radius': '28px',
  '--forum-radius-sm': '16px',
  '--forum-border-width': '1px',
};

const LIGHT_BASE: Record<string, string> = {
  '--forum-bg': '#f5f5f0',
  '--forum-surface': '#ffffff',
  '--forum-border': '#000',
  '--forum-border-subtle': 'rgba(0,0,0,0.06)',
  '--forum-text': '#1a1a2e',
  '--forum-text-secondary': 'rgba(0,0,0,0.65)',
  '--forum-text-muted': 'rgba(0,0,0,0.45)',
  '--forum-downvote': '#dc2626',
  '--forum-radius': '28px',
  '--forum-radius-sm': '16px',
  '--forum-border-width': '2px',
};

function makeColor(
  id: ForumColorId,
  label: string,
  swatch: string,
  accent: string,
  accentLight: string,
  onAccent: string,
  opts?: { darkAccent?: string; darkAccentLight?: string; darkOnAccent?: string },
): ForumColorDef {
  return {
    id,
    label,
    swatch,
    light: {
      ...LIGHT_BASE,
      '--forum-green': accent,
      '--forum-green-light': accentLight,
      '--forum-upvote': accent,
      '--forum-accent-vivid': accent,
      '--forum-on-accent': onAccent,
    },
    dark: {
      ...DARK_BASE,
      '--forum-green': opts?.darkAccent ?? accent,
      '--forum-green-light': opts?.darkAccentLight ?? accentLight,
      '--forum-upvote': opts?.darkAccent ?? accent,
      '--forum-accent-vivid': accent,
      '--forum-on-accent': opts?.darkOnAccent ?? onAccent,
    },
  };
}

export const FORUM_COLORS: ForumColorDef[] = [
  makeColor('lavender', 'Twilight Haze', '#b8b4f8', '#b8b4f8', '#ccc8ff', '#1a1a2e'),
  makeColor('lime', 'Electric Zest', '#EAFF7E', '#EAFF7E', '#f0ff9e', '#1a1a2e'),
  makeColor('mint', 'Glacier Mist', '#97F0E5', '#97F0E5', '#b0f8f0', '#1a1a2e'),
  makeColor('soft-purple', 'Velvet Dusk', '#E4CDFB', '#E4CDFB', '#eeddff', '#1a1a2e'),
  makeColor('chartreuse', 'Pear Drop', '#e8f5a3', '#e8f5a3', '#f0fabe', '#1a1a2e'),
  makeColor('beige', 'Sand Dune', '#f5f5dc', '#f5f5dc', '#fafaee', '#1a1a2e'),
  makeColor('pink', 'Rose Petal', '#FFD6E0', '#FFD6E0', '#ffe4ec', '#1a1a2e'),
  makeColor('sky-blue', 'Arctic Breeze', '#e0f2fe', '#e0f2fe', '#eef8ff', '#1a1a2e'),
  makeColor('cream', 'Honey Glow', '#fff9e6', '#fff9e6', '#fffcf0', '#1a1a2e'),
  makeColor('orange', 'Citrine Swirl', '#fb4903', '#fb4903', '#ff6830', '#fff',
    { darkAccent: '#fb6830', darkAccentLight: '#ff8850' }),
  makeColor('yellow', 'Banana Blitz', '#ffc507', '#ffc507', '#ffd840', '#1a1a2e'),
  makeColor('grey', 'Midnight Ink', '#121212', '#888', '#aaa', '#fff',
    { darkAccent: '#c0c0c0', darkAccentLight: '#d8d8d8', darkOnAccent: '#1a1a2e' }),
];

// Build flat FORUM_THEMES for backward compat (used by layout blocking script)
export const FORUM_THEMES: ForumTheme[] = FORUM_COLORS.flatMap((c) => [
  { id: `${c.id}-light`, label: c.label, swatch: c.swatch, vars: c.light },
  { id: `${c.id}-dark`, label: c.label, swatch: c.swatch, vars: c.dark },
]);

export function getThemeById(id: string): ForumTheme {
  return FORUM_THEMES.find((t) => t.id === id) || FORUM_THEMES[0];
}

export function getColorById(id: ForumColorId): ForumColorDef {
  return FORUM_COLORS.find((c) => c.id === id) || FORUM_COLORS[0];
}

export function resolveTheme(colorId: ForumColorId, mode: ForumMode): ForumTheme {
  const color = getColorById(colorId);
  const vars = mode === 'dark' ? color.dark : color.light;
  return { id: `${colorId}-${mode}`, label: color.label, swatch: color.swatch, vars };
}
