import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';

import './CreatePassword.scss';

function PasswordCreated() {
  console.log('Password created!');
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
        <p id="create-password-info-match" className="password-info">Success. Your passwords match!</p>
        <Link id="create-password-continue-link" className="link hoverable" to="/Home" onClick={PasswordCreated}>
          <h4>Continue</h4>
        </Link>
      </div>
    );
  } else if (passwordMatchState === 'mismatch') {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-mismatch" className="password-info">Uh oh. Your passwords don't match!</p>
      </div>
    );
  } else {
    passwordMatchElements = (
      <div id="create-password-match-elements">
        <p id="create-password-info-empty" className="password-info" />
      </div>
    );
  }

  return (
    <div id="create-password">
      <FontAwesomeIcon className="fa-icon" icon={faUnlock} size="4x" />
      <h1>Create a Password</h1>
      <h3>To make your wallet easy to access, create a strong password at least 8 characters long.</h3>
      <div id="create-password-entry" className="field-entry">
        <h5 id="create-password-password-label">Password</h5>
        <input id="create-password-password-input" type="password" name="password" onChange={handlePassword} />
        <h5 id="create-password-confirm-password-label">Confirm Password</h5>
        <input id="create-password-confirm-password-input" type="password" name="confirm password" onChange={handleConfirmPassword} />
      </div>
      {passwordMatchElements}
    </div>
  );
}

export default CreatePassword;
