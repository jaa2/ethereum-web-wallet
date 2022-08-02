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

/**
 * Delays closing the window for a period of time to allow a new window to be opened completely
 */
export const DelayedClose = () => {
  setTimeout(() => {
    window.close();
  }, 100);
};

/**
 * Finds the WindowType of the current window using context
 * @returns type of current window
 */
export function getWindowType(): WindowType {
  const { windowType } = useContext(WindowTypeContext);
  return windowType;
}

const OpenNewWindow = function OpenNewWindow() {
  // Get global WindowType state
  const { windowType } = useContext(WindowTypeContext);

  // Render button if popup
  if (windowType === WindowType.POPUP) {
    return (
      <div className="mx-2">
        <Link to={useLocation().pathname} target="_blank" rel="noopener noreferrer" onClick={DelayedClose}>
          <FontAwesomeIcon id="icon" className="fa-icon" icon={faExternalLinkAlt} size="2x" data-toggle="tooltip" title="Open in New Window" />
        </Link>
      </div>
    );
  }

  return null;
};

export default OpenNewWindow;
