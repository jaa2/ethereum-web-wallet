import browser from 'webextension-polyfill';

const themeStorageKey: string = 'theme';
const lightThemeUrl: string = 'themes/lux/bootstrap.min.css';
const darkThemeUrl: string = 'themes/darkly/bootstrap.min.css';

let currentTheme: string = 'light';

export function getTheme(): string {
  return currentTheme;
}

export function setTheme(newTheme: string, save: boolean = false) {
  const linkElement = document.getElementById('theme-style');
  if (newTheme === 'light') {
    if (linkElement !== null) {
      linkElement.setAttribute('href', lightThemeUrl);
    }
  } else if (newTheme === 'dark') {
    if (linkElement !== null) {
      linkElement.setAttribute('href', darkThemeUrl);
    }
  }

  if (currentTheme !== newTheme) {
    currentTheme = newTheme;
  }

  if (save) {
    browser.storage.local.set({ theme: currentTheme });
  }
  localStorage.setItem('theme', currentTheme);
}

export const ThemeSetter = function ThemeSetter() {
  browser.storage.local.get(themeStorageKey).then((r) => {
    if (!(themeStorageKey in r)) {
      setTheme(currentTheme);
    }
    return r.theme;
  })
    .then((theme: string) => {
      setTheme(theme);
    });
  const themeHref = localStorage.getItem('theme') === 'dark' ? darkThemeUrl : '';
  return (<link id="theme-style" rel="stylesheet" href={themeHref} />);
};
