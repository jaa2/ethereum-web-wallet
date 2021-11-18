import { ethers, Signer } from 'ethers';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { EtherscanProvider, TransactionResponse } from '@ethersproject/providers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faLock, faPaperPlane, faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';

import { BackgroundWindowInterface } from '../background/background';
import UserState from './common/UserState';
import AddressBox from './common/AddressBox';

import './Home.scss';

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
  [string, (matchState: string) => void] = React.useState<string>('0x510928a823b892093ac83904ef');

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
    <div id="home">
      <div className="top-bar mb-4">
        <div className="user">
          <img src="/avatar.png" alt="avatar" className="avatar" />
          <div id="home-user-options">
            <div className="option">
              <AddressBox address={address} />
            </div>
            <Link className="option" to="/ProfileSettings">
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="1x" fixedWidth />
              <p className="icon-label">Profile Settings</p>
            </Link>
            <Link className="option" to="/SignIn">
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" fixedWidth />
              <p className="icon-label">Lock Account</p>
            </Link>
          </div>
        </div>
        <div className="field no-unit-field">
          <select id="network-input" name="network">
            <option>Main Ethereum Network</option>
          </select>
        </div>
      </div>

      <div id="total" className="m-2">
        <h1>2.4529 ETH</h1>
        <h2>7,632.05 USD</h2>
      </div>

      <div id="assets" className="m-2">
        <label className="form-label" htmlFor="assets-table">Assets</label>
        <table id="assets-table" className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1000 Tether (USDT)</th>
              <td>$1000</td>
            </tr>
          </tbody>
        </table>
        <FontAwesomeIcon className="fa-icon" icon={faExchangeAlt} size="3x" />
        <p>Swap</p>
      </div>

      <div id="activity" className="m-2">
        <label className="form-label" htmlFor="activity-table">Recent Activity</label>
        <table id="activity-table" className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Action</th>
              <th scope="col">Gas Price</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">16 minutes ago</th>
              <td>Transfer 100 USDT to...</td>
              <td>108.5 Gwei</td>
              <td>Etherscan Link (WIP)</td>
            </tr>
          </tbody>
        </table>
        <Link to="/CreateTransaction">
          <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="3x" />
          <p>Send</p>
        </Link>
      </div>

      {/* <div className="row">
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
      </div> */}
    </div>
  );
}

export default Home;
