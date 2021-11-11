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
        <div id="settings-nav-button">
          <div>
            <Link to="/Home">
              <FontAwesomeIcon className="fa-icon" icon={faHome} size="1x" />
              <button type="button">Home</button>
            </Link>

          </div>
          <div>
            <Link to="/SignIn">
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" />
              <button type="button">Lock</button>
            </Link>

          </div>
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
        <h5>Delay Time</h5>
        <div id="dark-mode">
          <h5>Dark Mode</h5>
          <input type="checkbox" />
          <span id="slider" />
        </div>

        <button type="button">Delete Account</button>

      </div>
    </div>
  );
}

export default ProfileSettings;
