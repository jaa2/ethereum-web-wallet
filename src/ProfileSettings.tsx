import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faHome, faCopy,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
// import { faUserCircle, faHome } from '@fortawesome/free-solid-svg-icons';

function ProfileSettings() {
  return (
    <div id="profile-settings">
      <div className="container">
        <Link className="back-icon" to="/WalletSetup">
          <FontAwesomeIcon className="fa-icon" icon={faHome} size="2x" />
        </Link>
        <h1>Profile & Settings</h1>
      </div>
      {/* <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="4x" /> */}
      <div className="content-container">
        <div className="profile-left-section">
          <div className="profile-picture-edit">
            <div className="pic-section">
              <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="9x" />
            </div>
            <div className="edit-pic-section">
              <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            </div>
            {/* <div className="form-group">
              <input className="form-control" type="file" id="formFile" />
            </div> */}
          </div>
          <div className="profile-name-edit">
            <div>
              <p>Name</p>
            </div>
            <div>
              <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            </div>
          </div>
          <div className="user">
            <div className="address">0x510928a823b...</div>
            <FontAwesomeIcon className="copy fa-icon" icon={faCopy} />
          </div>
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
      <div className="button-container">
        <button type="button" className="btn btn-outline-danger">Delete Account</button>
      </div>
    </div>
  );
}

export default ProfileSettings;
