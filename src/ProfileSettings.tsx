import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faHome,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
import AddressBox from './common/AddressBox';

function ProfileSettings() {
  return (
    <div id="profile-settings">
      <div className="content-container">
        <div className="profile-left-section">
          <div id="settings-nav">
            <Link id="wallet-setup-import-key" className="link hoverable" to="/Home">
              <FontAwesomeIcon className="fa-icon" icon={faHome} size="2x" />
            </Link>
          </div>
          <div className="profile-picture-edit">
            <div className="pic-section">
              <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="9x" />
            </div>
            <div className="edit-pic-section">
              <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            </div>
          </div>
          <div className="profile-name-edit">
            <div>
              <p>Name</p>
            </div>
            <div>
              <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            </div>
          </div>
          {/* TODO: get address from state */}
          <AddressBox address="0x510928a823b" />
        </div>
        <div id="profile-right-section">
          <div id="delay-selection">
            <fieldset>
              <legend className="mt-1">Delay Time</legend>
              <div className="form-group">
                <select className="form-select" id="exampleSelect1">
                  <option>5 sec</option>
                  <option>10 sec</option>
                  <option>20 sec</option>
                  <option>30 sec</option>
                </select>
              </div>
            </fieldset>
          </div>
          <div id="dark-mode">
            <fieldset>
              <legend className="mt-1">Dark Mode</legend>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="button-container">
        <button type="button" className="btn btn-outline-danger">Delete Account</button>
      </div>
    </div>
  );
}

export default ProfileSettings;
