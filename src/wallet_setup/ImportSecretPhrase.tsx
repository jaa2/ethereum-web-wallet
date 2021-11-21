import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import './ImportSecretPhrase.scss';
import React, { ChangeEvent } from 'react';
import { ethers, Wallet } from 'ethers';
import browser from 'webextension-polyfill';
import { BackgroundWindowInterface } from '../../background/background';

async function ValidSecretPhrase(secretPhrase: string): Promise<boolean> {
  // Load the wallet
  const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const { walletState } = backgroundWindow.stateObj;
  const walletCreated: boolean = await walletState.createWalletFromPhrase(false, secretPhrase);
  const wallet: Wallet | null = !walletCreated ? null : await walletState.getWallet();
  return (walletCreated && wallet !== null);
}

const ImportSecretPhrase = function ImportSecretPhrase() {
  const [secretPhraseStatus, setSecretPhraseStatus]:
  [string, (state: string) => void] = React.useState<string>('length');
  const [inputDisabled, setInputDisabled]:
  [boolean, (state: boolean) => void] = React.useState<boolean>(false);
  const [secretPhrase, setSecretPhrase]:
  [string, (phrase: string) => void] = React.useState<string>('');
  const handleSecretPhrase = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value
      .trim()
      .replaceAll(/\s{2,}/g, ' ');
    setSecretPhrase(val);
    setSecretPhraseStatus(ethers.utils.isValidMnemonic(val) ? 'valid' : 'invalid');
  };

  const navigate: NavigateFunction = useNavigate();
  const onSecretPhrase = async () => {
    setInputDisabled(true);
    const resultSuccess: boolean = await ValidSecretPhrase(secretPhrase);
    setInputDisabled(false);
    if (resultSuccess) {
      // Redirect
      navigate('/CreatePassword');
    } else {
      throw new Error('Failed to create a wallet from a secret recovery phrase. Does a wallet already exist?');
    }
  };

  let matchElements: JSX.Element = (<div />);
  if (secretPhraseStatus === 'valid') {
    matchElements = (
      <div>
        <div id="info-match" className="valid-feedback text-success">Success. This is a valid wallet account!</div>
        <button
          className="btn btn-primary"
          type="button"
          disabled={inputDisabled}
          onClick={onSecretPhrase}
        >
          Continue
        </button>
      </div>
    );
  } else if (secretPhraseStatus === 'invalid') {
    matchElements = (
      <div>
        <p id="info-match" className="info text-warning">Please type in your secret recovery phrase.</p>
      </div>
    );
  }

  return (
    <div id="import-secret-phrase" className="container">
      <Link className="back-icon" to="/WalletSetup">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div className="container">
        <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="4x" />
        <h1>Import Secret Recovery Phrase</h1>
        <p>Enter your 12-word secret recovery phrase below.</p>
        <div className="form-group">
          <textarea
            className="form-control is-valid"
            id="secret-phrase"
            disabled={inputDisabled}
            cols={40}
            rows={4}
            onChange={(event) => handleSecretPhrase(event)}
          />
        </div>
        <h6>{' '}</h6>
        {matchElements}
      </div>
    </div>
  );
};

export default ImportSecretPhrase;
