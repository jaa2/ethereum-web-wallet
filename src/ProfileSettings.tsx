import React, { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faExclamationTriangle, faCogs, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
import Modal from 'react-bootstrap/Modal';
import AddressBox from './common/AddressBox';
import UserState from './common/UserState';
import { getTheme, setTheme } from './common/Theme';

const DangerConfim = function DangerConfirm() {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const deleteWallet = () => {
    UserState.getWalletState()
      .then((walletState) => (walletState === null ? Promise.reject(
        new Error('Failed to load wallet state'),
      ) : walletState))
      .then((walletState) => walletState.deleteWallet())
      .then(() => {
        // Navigate to Create New Wallet screen, now that the wallet has been deleted
        navigate('/');
      });
  };

  return (
    <div className="button-container">
      <button type="button" className="btn btn-outline-danger" onClick={showModal}>Delete Wallet</button>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <div id="max-tx-fee">
            <h3>
              <FontAwesomeIcon className="fa-icon" icon={faExclamationTriangle} size="2x" color="#489aca" />
              {' '}
              Confirm Wallet Deletion
            </h3>
          </div>
        </Modal.Header>
        <Modal.Body>
          If you delete your wallet, you will only be able to recover it from your secret recovery
          phrase (or private key) that you have already written down. Are you sure you want to
          delete your wallet?
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={hideModal}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={deleteWallet}>Delete</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const ProfileSettings = function ProfileSettings() {
  const [themeString, setThemeString] = React.useState<string>(getTheme());

  function toggleTheme(e: ChangeEvent<HTMLInputElement>) {
    const newTheme = e.currentTarget.checked ? 'dark' : 'light';
    setThemeString(newTheme);
    setTheme(newTheme, true);
  }

  return (
    <div id="profile-settings" className="container">
      <Link className="back-icon" to="/Home">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div id="content" className="container">
        <FontAwesomeIcon className="fa-icon" icon={faCogs} size="4x" />
        <h1>Settings</h1>
        <div id="content-container" className="container">
          <div className="container">
            <div id="profile-picture-edit" className="container">
              <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="9x" />
              <FontAwesomeIcon className="fa-icon" id="edit-icon" icon={faEdit} size="1x" />
            </div>
            <div id="profile-name-edit" className="container">
              <div id="name">
                Name
              </div>
              <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
            </div>
            {/* TODO: get address from state */}
            <div id="address-box" className="container">
              <AddressBox address="0x510928a823b" />
            </div>
          </div>
          <div className="container">
            <fieldset>
              <legend className="mt-1">Delay Time</legend>
              <div id="time-container" className="form-group">
                <select className="form-select" id="time">
                  <option>5 sec</option>
                  <option>10 sec</option>
                  <option>20 sec</option>
                  <option>30 sec</option>
                </select>
              </div>
            </fieldset>
            {/* </div> */}
            <div>
              <fieldset>
                <legend className="mt-1">Dark Mode</legend>
                <div id="appearance-switch" className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    checked={themeString === 'dark'}
                    onChange={toggleTheme}
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <DangerConfim />
    </div>
  );
};

export default ProfileSettings;
