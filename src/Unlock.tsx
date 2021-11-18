import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import './Unlock.scss';

// TODO: authenticate via backend and integrate w/ React Router
function Authenticate(password: string) {
  return password === 'expectedpassword';
}

function Unlock() {
  const [password, setPassword]: [string, (password: string) => void] = React.useState<string>('');
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <FontAwesomeIcon className="fa-icon" icon={faLock} size="3x" />
      <h1>Unlock Your Wallet</h1>
      <div className="form-group mb-3 unlock-page">
        <label className="form-label" htmlFor="unlock-password-input">Password</label>
        <input type="password" id="unlock-password-input" className="form-control" onChange={handlePassword} placeholder="Password" />
      </div>
      <Link to="/Home">
        <button type="button" id="unlock-button" className="btn btn-outline-primary" onClick={() => Authenticate(password)}>Unlock</button>
      </Link>
    </div>
  );
}

export default Unlock;
