import React, { useContext } from 'react';
import {
  Link, useLocation,
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

const DelayedClose = () => {
  setTimeout(() => {
    window.close();
  }, 100);
};

const OpenNewWindow = function OpenNewWindow() {
  // Get global WindowType state
  const { windowType } = useContext(WindowTypeContext);

  // Render button if popup
  if (windowType === WindowType.POPUP) {
    return (
      <Link to={useLocation().pathname} target="_blank" rel="noopener noreferrer" onClick={DelayedClose}>
        <FontAwesomeIcon id="icon" className="fa-icon" icon={faExternalLinkAlt} size="2x" data-toggle="tooltip" title="Open in New Window" />
      </Link>
    );
  }

  return null;
};

export default OpenNewWindow;
