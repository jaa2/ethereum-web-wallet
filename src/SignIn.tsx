import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import './SignIn.scss';

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
      <div id="sign-in-header">
        <FontAwesomeIcon className="fa-icon" icon={faLock} size="3x" />
        <h1>Ethereum Web Wallet Login</h1>
      </div>
      <div id="sign-in-entry" className="field-entry">
        <h5 id="sign-in-password-label">Password</h5>
        <input id="sign-in-password-input" type="password" name="password" onChange={handlePassword} />
      </div>
      <Link to="/Home">
        <button id="sign-in-login-button" className="bottom-button" type="button" onClick={() => Authenticate(password)}>Login</button>
      </Link>
    </div>
  );
}

export default SignIn;
