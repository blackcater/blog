import React from 'react';

const supportDarkMode =
  typeof window === 'undefined'
    ? false
    : window.matchMedia('(prefers-color-scheme)').media !== 'not all';
const DEFAULT_THEME = supportDarkMode ? 'dark' : 'light';
const THEMES = ['light', 'dark'];
const ThemeContext = React.createContext(DEFAULT_THEME);

export default ThemeContext;
export { supportDarkMode, DEFAULT_THEME, THEMES };
