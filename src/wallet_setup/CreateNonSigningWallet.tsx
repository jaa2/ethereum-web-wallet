import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import browser from 'webextension-polyfill';

import './ImportPrivateKey.scss';
import React from 'react';
import { ethers } from 'ethers';
import { BackgroundWindowInterface } from '../../background/background';

async function validAddress(address: string) {
  // Create a new wallet
  const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const { walletState } = backgroundWindow.stateObj;
  const walletCreated: boolean = await walletState.createNonSigningWallet(false, address);
  if (walletCreated) {
    await walletState.saveWallet(false, '');
  }

  // Show secret recovery phrase
  const wallet = !walletCreated ? null : await walletState.getWallet();
  return (walletCreated && wallet !== null);
}

const CreateNonSigningWallet = function CreateNonSigningWallet() {
  const [address, setAddress]: [string, (address: string) => void] = React.useState<string>('');
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const navigate: NavigateFunction = useNavigate();
  const onValidAddress = async () => {
    const resultSuccess: boolean = await validAddress(address);
    if (resultSuccess) {
      // Redirect
      navigate('/Home');
    } else {
      throw new Error('Failed to create a non-signing wallet. Does a wallet already exist?');
    }
  };

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Do not actually submit a form
    e.preventDefault();
    onValidAddress();
  }

  let isValidAddress: boolean = (address.length > 0);
  try {
    ethers.utils.getAddress(address);
    isValidAddress = true;
  } catch (e) {
    isValidAddress = false;
  }

  let statusElements: JSX.Element;
  if (isValidAddress) {
    statusElements = (
      <div>
        <p className="phrase-info text-success">Valid address.</p>
        <div className="link hoverable">
          <button type="submit" className="btn btn-primary">Continue</button>
        </div>
      </div>
    );
  } else {
    statusElements = (
      <div className="content-container">
        <p className="private-key-info text-warning">Your address should contain 40 hexadecimal characters.</p>
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
        <h1>Create View-Only/Non-Signing Wallet</h1>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="private-key-input" className="form-label mt-4">Enter the address of the wallet.</label>
          <div className="input-group mb-3">
            <input className="form-control" id="key-input" type="text" name="privateKey" onChange={handleAddressChange} />
          </div>
          {statusElements}
        </div>
      </form>
    </div>
  );
};

export default CreateNonSigningWallet;
