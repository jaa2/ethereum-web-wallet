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
  // Smaller extension window
  EXTENSION,
  // Full-fledged browser window
  FULLSCREEN,
}

export const WindowTypeContext = React.createContext({
  windowType: WindowType.EXTENSION,
  setWindowType: (_: WindowType) => {}, /* eslint-disable-line */
});

const OpenNewWindow = function OpenNewWindow() {
  // Get global WindowType state
  const { windowType, setWindowType } = useContext(WindowTypeContext);
  const location = useLocation();

  // Check search params to see if WindowType changed
  if (location.search) {
    const searchParams = new URLSearchParams(location.search);
    const newWindowType = searchParams.get('windowType');
    if (newWindowType === 'fullscreen') {
      setWindowType(WindowType.FULLSCREEN);
    }
  }

  // Don't render button if fullscreen
  if (windowType === WindowType.FULLSCREEN) {
    return null;
  }

  return (
    <Link to={`${useLocation().pathname}?windowType=fullscreen`} target="_blank">
      <FontAwesomeIcon id="icon" className="fa-icon" icon={faExternalLinkAlt} size="2x" data-toggle="tooltip" title="Open in New Window" />
    </Link>
  );
};

export default OpenNewWindow;
