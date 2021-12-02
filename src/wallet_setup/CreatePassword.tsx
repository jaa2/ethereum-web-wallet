import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

import './CreatePassword.scss';
import { BackgroundWindowInterface } from '../../background/background';

/**
 * Called once the password has been created and confirmed
 */
async function PasswordCreated(password: string): Promise<void> {
  // Get wallet state
  const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const { walletState } = backgroundWindow.stateObj;
  // Encrypt wallet
  const result = walletState.saveEncryptedWallet(false, password);
  if (!result) {
    throw new Error('Could not save');
  }
}

const CreatePassword = function CreatePassword() {
  const [passwordMatchState, setPasswordMatchState]: [string, (matchState: string) => void] = React.useState<string>('empty');
  // eslint-disable-next-line max-len
  const [isEncrypting, setIsEncrypting]: [boolean, (encrypting: boolean) => void] = React.useState<boolean>(false);

  const [password, setPassword]: [string, (password: string) => void] = React.useState<string>('');
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const [confirmPassword, setConfirmPassword]: [string, (confirmPassword: string) => void] = React.useState<string>('');
  const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  useEffect(() => {
    // TODO: add more password authentication (length, char type, etc.)
    if (confirmPassword.length === 0) {
      setPasswordMatchState('empty');
    } else if (password !== confirmPassword) {
      setPasswordMatchState('mismatch');
    } else {
      setPasswordMatchState('match');
    }
  }, [password, confirmPassword]);

  const navigate: NavigateFunction = useNavigate();

  const handlePasswordCompleted = async () => {
    // Display encrypting spinner
    setIsEncrypting(true);
    // Encrypt
    await PasswordCreated(password);
    // Redirect
    setIsEncrypting(false);
    navigate('/Home');
  };

  let passwordMatchElements: JSX.Element = (<div />);
  // handle additional state where the user's password doesn't meet requirements
  if (password.length < 8) {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-mismatch" className="password-info text-danger">Your password is not at least 8 characters!</p>
      </div>
    );
  } else if (passwordMatchState === 'match') {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-match" className="password-info text-success">Success. Your passwords match!</p>
        <button type="button" id="create-password-continue-link" className="btn btn-primary" onClick={handlePasswordCompleted}>
          Continue
        </button>
      </div>
    );
  } else if (passwordMatchState === 'mismatch') {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-mismatch" className="password-info text-danger">Uh oh. Your passwords don&apos;t match!</p>
      </div>
    );
  } else {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-warning" className="form-text text-warning">Make sure to not share this password with anyone else!</p>
      </div>
    );
  }

  if (isEncrypting) {
    // TODO: The ellipsis should become a Bootstrap spinner
    return (
      <div id="create-password">
        <h3>Encrypting...</h3>
      </div>
    );
  }

  return (
    <div id="create-password">
      <FontAwesomeIcon className="fa-icon" icon={faUnlock} size="4x" />
      <h1>Create a Password</h1>
      <p className="password-hint-text">
        To access your wallet, create a strong password that is at least 8 characters
        long.
      </p>
      <div id="create-password-password-entry" className="form-group mb-3">
        <label className="form-label" htmlFor="sign-in-password-input">Password</label>
        <input type="password" id="create-password-password-input" className="form-control" onChange={handlePassword} placeholder="Password" />
      </div>
      <div id="create-password-confirm-password-entry" className="form-group mb-3">
        <label className="form-label" htmlFor="sign-in-confirm-password-input">Confirm Password</label>
        <input type="password" id="create-password-confirm-password-input" className="form-control" onChange={handleConfirmPassword} placeholder="Confirm Password" />
      </div>

      {passwordMatchElements}
    </div>
  );
};

export default CreatePassword;
