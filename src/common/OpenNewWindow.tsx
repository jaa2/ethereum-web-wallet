import React, { useContext } from 'react';
import {
  useLocation,
} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * Indicates the current window type the extension is running in
 */
export enum WindowType {
  // Smaller extension popup window
  POPUP,
  // Full-fledged browser window
  FULLSCREEN,
}

export const WindowTypeContext = React.createContext({
  windowType: WindowType.FULLSCREEN,
  setWindowType: (_: WindowType) => {}, /* eslint-disable-line */
});

const OpenNewWindow = function OpenNewWindow() {
  // Get global WindowType state
  const { windowType, setWindowType } = useContext(WindowTypeContext);
  const location = useLocation();

  // Check search params to see if WindowType changed
  const locSearch = location.search ? location.search : window.location.search;
  if (locSearch) {
    const searchParams = new URLSearchParams(locSearch);
    const newWindowType = searchParams.get('windowType');
    if (newWindowType === 'popup') {
      setWindowType(WindowType.POPUP);
    }
  }

  // Don't render button if fullscreen
  if (windowType === WindowType.FULLSCREEN) {
    return null;
  }

  // Reset search params
  location.search = '';
  return (
    <a href={`${window.location.pathname}?windowType=fullscreen`} target="_blank" rel="noreferrer">
      <FontAwesomeIcon id="icon" className="fa-icon" icon={faExternalLinkAlt} size="2x" data-toggle="tooltip" title="Open in New Window" />
    </a>
  );
};

export default OpenNewWindow;
