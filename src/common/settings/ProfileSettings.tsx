import React, { ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faExclamationTriangle, faCogs, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
import Modal from 'react-bootstrap/Modal';
import { UserAddressBox } from '../AddressBox';
import UserState from '../UserState';
import { getTheme, setTheme } from './Theme';
import Config from './Config';
import Toggle from './Toggle';

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

const config: Config = new Config();

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
            </div>
            <div id="address-box" className="container">
              <UserAddressBox />
            </div>
          </div>
          <div className="container">
            <div>
              <fieldset>
                <legend className="mt-1">Dark Mode</legend>
                <div className="settings-switch form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={themeString === 'dark'}
                    onChange={toggleTheme}
                  />
                </div>
              </fieldset>
              <Toggle config={config} configKey="showDataField" label="Show Data Field" />
              <fieldset>
                <legend className="mt-1">Custom Networks</legend>
                <Link to="/AddProviderNetwork">
                  <button type="button" className="btn btn-info">Add Network</button>
                </Link>
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
