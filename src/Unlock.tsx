import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import './Unlock.scss';
import { ProgressBar } from 'react-bootstrap';
import UserState from './common/UserState';

const Unlock = function Unlock() {
  const [password, setPassword]: [string, (password: string) => void] = React.useState<string>('');
  const [failReason, setFailReason]: [string | undefined,
    (reason: string | undefined) => void] = React.useState<string | undefined>();
  const [decryptionProgress, setDecryptionProgress]: [number | undefined,
    (progress: number | undefined) => void] = React.useState<number | undefined>();
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const navigate: NavigateFunction = useNavigate();
  function checkPassword() {
    UserState.getWalletState()
      .then((state) => state.decryptWallet(password, setDecryptionProgress))
      .then(() => {
        navigate('/Home');
      })
      .catch((reason: Error) => {
        setFailReason(reason.message);
        setDecryptionProgress(undefined);
        setPassword('');
      });
  }

  let progressBar: JSX.Element = <div />;
  if (decryptionProgress !== undefined) {
    progressBar = (
      <div>
        <div className="small mt-3 text-center">Decrypting wallet...</div>
        <ProgressBar className="progress-instant" max={1} now={decryptionProgress} />
      </div>
    );
  }

  const canUnlock: boolean = (decryptionProgress === undefined);
  let invalidFeedback: JSX.Element = <div />;
  if (failReason !== undefined) {
    invalidFeedback = <div className="d-block invalid-feedback">{failReason}</div>;
  }

  return (
    <div className="unlock-page">
      <FontAwesomeIcon className="fa-icon" icon={faLock} size="3x" />
      <h1>Unlock Your Wallet</h1>
      <div className="form-group mb-3">
        <label className="form-label" htmlFor="unlock-password-input">Password</label>
        <input type="password" id="unlock-password-input" className="form-control" onChange={handlePassword} placeholder="Password" />
        {invalidFeedback}
        {progressBar}
      </div>
      <button type="button" id="unlock-button" className="btn btn-primary" onClick={checkPassword} disabled={!canUnlock}>Unlock</button>
    </div>
  );
};

export default Unlock;
