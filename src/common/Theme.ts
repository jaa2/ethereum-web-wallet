const DARK_STYLE_LINK = document.getElementById('dark-theme-style');
const THEME_TOGGLER = document.getElementById('theme-toggler');
const LOCAL_STORAGE_KEY = 'toggle-bootstrap-theme';
const LOCAL_META_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
const DARK_THEME_PATH = 'https://bootswatch.com/4/cyborg/bootstrap.min.css';
let isDark = LOCAL_META_DATA && LOCAL_META_DATA.isDark;

export function enableDarkTheme() {
  if (DARK_STYLE_LINK && THEME_TOGGLER) {
    DARK_STYLE_LINK.setAttribute('href', DARK_THEME_PATH);
    THEME_TOGGLER.innerHTML = '🌙 Dark';
  }
}

export function disableDarkTheme() {
  if (DARK_STYLE_LINK && THEME_TOGGLER) {
    DARK_STYLE_LINK.setAttribute('href', '');
    THEME_TOGGLER.innerHTML = '🌞 Light';
  }
}

export function toggleTheme() {
  isDark = !isDark;
  if (isDark) {
    enableDarkTheme();
  } else {
    disableDarkTheme();
  }
  const META = { isDark };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(META));
}

export function setTheme() {
  if (isDark) {
    enableDarkTheme();
  } else {
    disableDarkTheme();
  }
}
