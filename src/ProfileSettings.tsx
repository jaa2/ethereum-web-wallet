import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faExclamationTriangle, faCogs, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
import Modal from 'react-bootstrap/Modal';
import AddressBox from './common/AddressBox';

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

function ProfileSettings() {
  return (
    <div id="profile-settings" className="container">
      <Link className="back-icon" to="/Home">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div id="content" className="container">
        <FontAwesomeIcon className="fa-icon" icon={faCogs} size="4x" />
        <h1 className="text-center">Settings</h1>
        <div id="content-container" className="container">
          <div className="profile-left-section">
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
                  <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
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
