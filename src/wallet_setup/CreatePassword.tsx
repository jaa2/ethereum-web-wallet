import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';

import './CreatePassword.scss';

function PasswordCreated() {
  console.log('TODO: Password created!');  // eslint-disable-line
}

function CreatePassword() {
  const [passwordMatchState, setPasswordMatchState]: [string, (matchState: string) => void] = React.useState<string>('empty');

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

  let passwordMatchElements: JSX.Element = (<div />);
  // handle additional state where the user's password doesn't meet requirements
  if (passwordMatchState === 'match') {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-match" className="password-info text-success">Success. Your passwords match!</p>
        <Link to="/Home" onClick={PasswordCreated}>
          <button type="button" id="create-password-continue-button" className="btn btn-outline-primary">Continue</button>
        </Link>
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

  return (
    <div id="create-password">
      <FontAwesomeIcon className="fa-icon" icon={faUnlock} size="4x" />
      <h1>Create a Password</h1>
      <h3>
        To access your wallet, create a strong password that is at least 8 characters
        long.
      </h3>
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
}

export default CreatePassword;
