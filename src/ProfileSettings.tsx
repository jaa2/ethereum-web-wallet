import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faExclamationTriangle, faCogs, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
import Modal from 'react-bootstrap/Modal';
import AddressBox from './common/AddressBox';
import { toggleTheme } from './common/Theme';
// import
// // you can use app's unique identifier here
// export const LOCAL_STORAGE_KEY = 'toggle-bootstrap-theme';
// export const LOCAL_META_DATA = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
// // you can change this url as needed
// export const DARK_THEME_PATH = 'https://bootswatch.com/4/cyborg/bootstrap.min.css';
// export let isDark = LOCAL_META_DATA && LOCAL_META_DATA.isDark;

const DangerConfim = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="button-container">
        <button type="button" className="btn btn-outline-danger" onClick={showModal}>Delete Account</button>
        <Modal show={isOpen} onHide={hideModal}>
          <Modal.Header>
            <div id="max-tx-fee">
              <h3>
                <FontAwesomeIcon className="fa-icon" icon={faExclamationTriangle} size="2x" color="#489aca" />
                {' '}
                Confirm Delete Account
              </h3>
            </div>
          </Modal.Header>
          <Modal.Body>
            If you delete account, you can not restore this account.
            Are you sure to delete your account?
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={hideModal}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={hideModal}>Delete</button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

// let isDark = '';
// export const isDarkChange = () => LOCAL_META_DATA && LOCAL_META_DATA.isDark;
// export { isDark as default};

function ProfileSettings() {
  return (
    <div id="profile-settings" className="container">
      <Link className="back-icon" to="/Home">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div id="content" className="container">
        <FontAwesomeIcon className="fa-icon" icon={faCogs} size="4x" />
        <h1>Settings</h1>
        <div id="content-container" className="container">
          <div>
            <div id="profile-picture-edit" className="container">
              <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="9x" />
              <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            </div>
            <div id="profile-name-edit" className="container">
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
          <div>
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
            {/* </div> */}
            <div id="dark-mode">
              <fieldset>
                <legend className="mt-1">Dark Mode</legend>
                <div className="form-check form-switch">
                  <link id="dark-theme-style" rel="stylesheet" />
                  <nav className="navbar navbar-transparent">
                    <button
                      type="button"
                      className="btn btn-outline-info btn-lg ml-auto font-weight-bold"
                      id="theme-toggler"
                      onClick={toggleTheme}
                      aria-hidden="true"
                    />
                  </nav>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <DangerConfim />
    </div>
  );
}

export default ProfileSettings;
