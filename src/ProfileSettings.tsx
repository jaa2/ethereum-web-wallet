import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faCloudUploadAlt, faKey, faPlus, faUsers, faUserEdit, faUserCircle, faEdit, faHome, faLock } from '@fortawesome/free-solid-svg-icons';

import './ProfileSettings.scss'

function ProfileSettings() {



  return (
    <div id="profile-settings">

      <div id="profile-left-section">
        <div id="settings-nav-button">
          <div>
            <FontAwesomeIcon className="fa-icon" icon={faHome} size="1x" />
            <button>Home</button>

          </div>
          <div>
            <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" />
            <button>Lock</button>

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
        <button>0x51912454541...</button>
      </div>

      <div id="profile-right-section">
        <h3>Profile & Settings</h3>
        <h5>Delay Time</h5>
        <div id="dark-mode">
          <h5>Dark Mode</h5>
          <input type="checkbox"/>
          <span id="slider"></span>
        </div>
        

        <button>Delete Account</button>
        

      </div>
    </div>
  );
}

export default ProfileSettings;