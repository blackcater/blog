import React from 'react';

const DEFAULT_THEME = 'light';
const THEMES = ['light', 'dark'];
const ThemeContext = React.createContext(DEFAULT_THEME);

export default ThemeContext;
export { DEFAULT_THEME, THEMES };
