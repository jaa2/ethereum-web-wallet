import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faHome, faLock,
} from '@fortawesome/free-solid-svg-icons';

import './ProfileSettings.scss';

function ProfileSettings() {
  return (
    <div id="profile-settings">

      <div id="profile-left-section">
        <div id="settings-nav">
          <Link id="wallet-setup-import-key" className="link hoverable" to="/Home">
            <FontAwesomeIcon className="fa-icon" icon={faHome} size="1x" />
            <h6>Home</h6>
          </Link>
          <Link id="wallet-setup-import-key" className="link hoverable" to="/Unlock">
            <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" />
            <h6>Unlock</h6>
          </Link>
        </div>
        <div id="profile-picture-edit">
          <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="7x" />
          <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
        </div>

        <div id="profile-name-edit">
          <text>Name</text>
          <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
        </div>
        <button type="button">0x51912454541...</button>
      </div>

      <div id="profile-right-section">
        <h3>Profile & Settings</h3>
        <div id="delay-selection">
          <div id="delay-selection-content">
            <h5>Delay Time</h5>
          </div>
          <div id="delay-selection-content">
            <select id="to-address-input" name="to-address">
              <option>5 sec</option>
              <option>10 sec</option>
              <option>20 sec</option>
              <option>30 sec</option>
            </select>
          </div>
        </div>
        <div id="dark-mode">
          <div id="dark-mode-content">
            <h5>Dark Mode</h5>
          </div>
          <div id="dark-mode-content">
            <input type="checkbox" />
          </div>
          {/* <span id="slider"></span> */}
        </div>
        <button type="button">Delete Account</button>
      </div>
    </div>
  );
}

export default ProfileSettings;
