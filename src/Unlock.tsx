import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import './Unlock.scss';

// TODO: authenticate via backend and integrate w/ React Router
function Authenticate(password: string) {
  return password === 'expectedpassword';
}

function SignIn() {
  const [password, setPassword]: [string, (password: string) => void] = React.useState<string>('');
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div id="sign-in">
      <FontAwesomeIcon className="fa-icon" icon={faLock} size="3x" />
      <h1>Unlock Ethereum Web Wallet </h1>
      <div id="sign-in-entry" className="form-group mb-3">
        <label className="form-label" htmlFor="sign-in-password-input">Password</label>
        <input type="password" id="sign-in-password-input" className="form-control" onChange={handlePassword} placeholder="Password" />
      </div>
      <Link to="/Home">
        <button type="button" id="sign-in-login-button" className="btn btn-outline-primary" onClick={() => Authenticate(password)}>Unlock</button>
      </Link>
    </div>
  );
}

export default SignIn;
