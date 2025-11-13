export const themes = ['modern', 'classic'] as const;
export type Theme = (typeof themes)[number];
export const themeKey = 'theme';
export const defaultTheme = 'modern';
