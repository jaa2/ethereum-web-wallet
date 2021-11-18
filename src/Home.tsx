import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faCog, faLock, faPaperPlane, faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import browser from 'webextension-polyfill';

import './Home.scss';
import { EtherscanProvider, TransactionResponse } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import React, { useEffect } from 'react';
import { BackgroundWindowInterface } from '../background/background';
import UserState from './common/UserState';

/**
 * Get a list of recent transactions
 * @returns A promise containing a list of recent transactions
 */
async function getRecentTransactions():
Promise<Array<TransactionResponse>> {
  const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const signer: Signer | null = await backgroundWindow.stateObj.walletState.getWalletSafe();
  if (signer === null) {
    return new Array<TransactionResponse>();
  }

  const { provider } = backgroundWindow.stateObj;
  if (provider !== null && 'getHistory' in provider) {
    const addr: string = await signer.getAddress();
    const txs = await (provider as EtherscanProvider).getHistory(addr);
    txs.sort((a: TransactionResponse, b: TransactionResponse) => {
      if (a.blockNumber === undefined && b.blockNumber === undefined) {
        return 0;
      } if (a.blockNumber === undefined) {
        return -1;
      } if (b.blockNumber === undefined) {
        return 1;
      }
      return b.blockNumber - a.blockNumber;
    });
    return txs;
  }

  return new Array<TransactionResponse>();
}

function Home() {
  const [currentTransactions, setCurrentTransactions]:
  [Array<TransactionResponse>, (responses: Array<TransactionResponse>) => void] = React.useState<
  Array<TransactionResponse>
  >(Array<TransactionResponse>());
  const [address, setAddress]:
  [string, (matchState: string) => void] = React.useState<string>('defa11add2e55');

  useEffect(() => {
    UserState.getAddress().then((newAddress) => {
      if (newAddress !== null) {
        setAddress(newAddress);
      }
    });
    getRecentTransactions().then((response) => {
      setCurrentTransactions(response);
    });
  }, []);

  const navigate: NavigateFunction = useNavigate();
  const lockWallet = () => {
    UserState.getWalletState().then((state) => {
      state.lockWallet();
      navigate('/SignIn');
    });
  };

  const transactionList: Array<JSX.Element> = [];
  for (let i = 0; i < currentTransactions.length; i += 1) {
    // Find the date the transaction was included, if available
    let date:string = '';
    const { timestamp } = currentTransactions[i];
    if (timestamp !== undefined) {
      date = (new Date(timestamp * 1000)).toLocaleString();
    }
    // Find the transaction type (IN or OUT) - Etherscan only
    let type = 'OUT';
    if (currentTransactions[i].to === address && currentTransactions[i].from !== address) {
      type = 'IN';
    }
    transactionList.push(
      <p>
        <b>
          {type}
          :
        </b>
        {' '}
        {currentTransactions[i].nonce}
        {' '}
        (
        {date}
        ):
        {' '}
        {currentTransactions[i].to}
        {' '}
        for
        {' '}
        {ethers.utils.formatEther(currentTransactions[i].value)}
        {' '}
        ETH
      </p>,
    );
  }

  return (
    <div className="container">
      <div className="top-bar">
        <div className="user">
          <img src="../public/avatar.png" alt="avatar" className="avatar" />
          <div className="user-options">
            <div className="option">
              <div className="address">{address}</div>
              <FontAwesomeIcon className="copy fa-icon" icon={faCopy} />
            </div>
            <Link className="option" to="/ProfileSettings">
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="2x" />
              <p className="icon-label">Settings</p>
            </Link>
            <button type="button" className="option btn btn-link" onClick={lockWallet}>
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="2x" />
              <p className="icon-label">Lock</p>
            </button>
          </div>
        </div>
        <div className="field no-unit-field">
          <select id="network-input" name="network">
            <option>Main Ethereum Network</option>
          </select>
        </div>
      </div>
      <h1>2.4529 ETH</h1>
      <h2>7,632.05 USD</h2>
      <div className="row">
        <div>
          <h3>Assets:</h3>
          <div className="table" />
          <FontAwesomeIcon className="fa-icon" icon={faExchangeAlt} size="3x" />
          <p>Swap</p>
        </div>
        <div>
          <h3>Activity:</h3>
          <div className="table">
            {transactionList}
          </div>
          <Link to="/CreateTransaction">
            <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="3x" />
            <p>Send</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
