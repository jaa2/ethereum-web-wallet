import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faHome,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
// import { faUserCircle, faHome } from '@fortawesome/free-solid-svg-icons';

function ProfileSettings() {
  return (
    <div className="profile-settings">
      <div className="container">
        <Link className="back-icon" to="/WalletSetup">
          <FontAwesomeIcon className="back-icon" icon={faHome} size="2x" />
        </Link>
        <h1>Profile & Settings</h1>
      </div>
      {/* <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="4x" /> */}
      <div className="content-container">
        <div className="profile-left-section">
          <div id="profile-picture-edit">
            <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="7x" />
            <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            {/* <div className="form-group">
              <input className="form-control" type="file" id="formFile" />
            </div> */}
          </div>
          <div id="profile-name-edit">
            <text>Name</text>
            <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
          </div>
          <button type="button">0x51912454541...</button>
        </div>
        <div id="profile-right-section">
          <div id="delay-selection">
            {/* <form> */}
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
            {/* </form> */}
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
      <div className="container">
        <button type="button" className="btn btn-outline-danger">Delete Account</button>
      </div>
    </div>
  );
}

export default ProfileSettings;
