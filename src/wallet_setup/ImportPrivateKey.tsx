import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import browser from 'webextension-polyfill';

import './ImportPrivateKey.scss';
import React from 'react';
import { ethers } from 'ethers';
import { BackgroundWindowInterface } from '../../background/background';

async function ValidPrivateKey(privateKey: string) {
  // Create a new wallet
  const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const { walletState } = backgroundWindow.stateObj;
  const walletCreated: boolean = await walletState.createWallet(false, privateKey);

  // Show secret recovery phrase
  const wallet = !walletCreated ? null : await walletState.getWallet();
  return (walletCreated && wallet !== null);
}

const ImportPrivateKey = function ImportPrivateKey() {
  // comments removed use of hooks
  const [privateKeyStatus, setPrivateKeyStatus]:
  [string, (matchState: string) => void] = React.useState<string>('length');

  const [privateKey, setPrivateKey]:
  [string, (privateKey: string) => void] = React.useState<string>('');
  const handlePrivateKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Append 0x prefix if it doesn't already exist
    let pkeyStr = event.target.value;
    if (!pkeyStr.startsWith('0x')) {
      pkeyStr = `0x${pkeyStr}`;
    }
    setPrivateKey(pkeyStr);

    if (!ethers.utils.isHexString(pkeyStr)) {
      setPrivateKeyStatus('encoding');
    } else if (ethers.utils.hexDataLength(pkeyStr) !== 32) {
      setPrivateKeyStatus('length');
    } else {
      setPrivateKeyStatus('valid');
    }
  };

  const navigate: NavigateFunction = useNavigate();
  const onValidPrivateKey = async () => {
    const resultSuccess: boolean = await ValidPrivateKey(privateKey);
    if (resultSuccess) {
      // Redirect
      navigate('/CreatePassword');
    } else {
      throw new Error('Failed to create a wallet from a private key. Does a wallet already exist?');
    }
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Do not actually submit a form
    e.preventDefault();
    onValidPrivateKey();
  }

  let privateKeyStatusElements: JSX.Element = (<div />);

  if (privateKeyStatus === 'valid') {
    privateKeyStatusElements = (
      <div>
        <p className="phrase-info text-success">Valid private key.</p>
        <div className="link hoverable">
          <button type="submit" className="btn btn-primary">Continue</button>
        </div>
      </div>
    );
  } else if (privateKeyStatus === 'encoding') {
    privateKeyStatusElements = (
      <div className="content-container">
        <p className="private-key-info text-warning">Your private key should be a hexidecimal string.</p>
      </div>
    );
  } else if (privateKeyStatus === 'length') {
    privateKeyStatusElements = (
      <div className="content-container">
        <p className="private-key-info text-warning">Your private key should be 64 hex characters long.</p>
      </div>
    );
  }

  return (
    <div id="import-private-key">
      <Link className="back-icon" to="/WalletSetup">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div>
        <FontAwesomeIcon className="fa-icon" icon={faKey} size="4x" />
        <h1>Import Private Key</h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="private-key-input" className="form-label mt-4">Enter your private key below</label>
          <div className="input-group mb-3">
            <input className="form-control" id="key-input" type="text" name="privateKey" onChange={handlePrivateKey} />
          </div>
          {privateKeyStatusElements}
        </div>
      </form>
    </div>
  );
};

export default ImportPrivateKey;
