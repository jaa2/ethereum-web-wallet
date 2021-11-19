import {
  BigNumber, ethers, Signer,
} from 'ethers';
import React, { useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { EtherscanProvider, TransactionResponse } from '@ethersproject/providers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faLock, faPaperPlane, faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

import { BackgroundWindowInterface } from '../background/background';
import UserState from './common/UserState';
import AddressBox from './common/AddressBox';

import './Home.scss';
import WalletState from '../background/WalletState';
import currentETHtoUSD from './common/UnitConversion';

const CancelModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button type="button" className="mx-1 btn btn-primary" onClick={showModal}>Cancel</button>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          Cancel Transaction
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to cancel this transaction?
          </p>
          <p>
            Estimated gas fee for canceling: 0.00351 gwei
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={hideModal}>Close</button>
          <button type="button" className="btn btn-primary" onClick={hideModal}>Confirm</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

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

interface TransactionEntry {
  type: string,
  nonce: number,
  date: string,
  destination: string | undefined,
  amount: string
}

function Home() {
  const [currentTransactions, setCurrentTransactions]:
  [Array<TransactionResponse>, (responses: Array<TransactionResponse>) => void] = React.useState<
  Array<TransactionResponse>
  >(Array<TransactionResponse>());
  const [address, setAddress]:
  [string, (matchState: string) => void] = React.useState<string>('0x510928a823b892093ac83904ef');
  const [currentETH, setCurrentETH]:
  [BigNumber, (state: BigNumber) => void] = React.useState<BigNumber>(BigNumber.from(0));
  const [currentETHValue, setCurrentETHValue] = React.useState<number>(0);
  const [currentETHAsUSD, setCurrentETHAsUSD]:
  [number, (state: number) => void] = React.useState<number>(0);

  useEffect(() => {
    UserState.getAddress().then((newAddress) => {
      if (newAddress === null) {
        return Promise.reject();
      }
      return newAddress;
    })
      .then((newAddress) => setAddress(newAddress))
      .then(UserState.getWalletState)
      .then((state: WalletState) => {
        if (state === null) {
          return Promise.reject();
        }
        return state;
      })
      .then((state) => state.getWalletSafe())
      .then((wallet: Signer | null) => {
        if (wallet === null) {
          return Promise.reject();
        }
        return UserState.getProvider()
          .then((provider) => {
            if (provider === null) {
              return Promise.reject();
            }
            return wallet.connect(provider);
          });
      })
      .then((wallet: Signer) => wallet.getBalance())
      .then((balance: BigNumber) => {
        setCurrentETH(balance);
      });
    getRecentTransactions().then((response) => {
      setCurrentTransactions(response);
    });

    // Get ETH value in USD
    UserState.getProvider().then((provider) => {
      if (provider === null) {
        return Promise.reject();
      }
      return provider;
    })
      .then((provider) => currentETHtoUSD(1, provider))
      .then((valInUSD) => {
        setCurrentETHValue(valInUSD);
      });
  }, []);

  useEffect(() => {
    setCurrentETHAsUSD(Number(ethers.utils.formatEther(currentETH)) * currentETHValue);
  }, [currentETH, currentETHValue]);

  const navigate: NavigateFunction = useNavigate();
  const lockWallet = () => {
    UserState.getWalletState().then((state) => {
      state.lockWallet();
      navigate('/Unlock');
    });
  };

  const transactionList: Array<TransactionEntry> = [];
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
    transactionList.push({
      type,
      nonce: currentTransactions[i].nonce,
      date,
      destination: currentTransactions[i].to,
      amount: ethers.utils.formatEther(currentTransactions[i].value),
    });
  }

  const onReplaceTransaction = (nonce: number, dest: string, amount: string) => {
    navigate('/CreateTransaction', {
      state: {
        nonce,
        dest,
        amount,
      },
    });
  };

  return (
    <div id="home">
      <div className="top-bar mb-4">
        <div className="user">
          <img src="/avatar.png" alt="avatar" className="avatar" />
          <div id="home-user-options">
            <div className="option">
              <AddressBox address={address} />
            </div>
            {/* <Link className="option" to="/ProfileSettings">
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="1x" fixedWidth />
              <p className="icon-label">Profile Settings</p>
            </Link> */}
            <button type="button" className="option btn btn-link" onClick={() => navigate('/ProfileSettings')}>
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="1x" fixedWidth />
              <p className="icon-label">Profile Settings</p>
            </button>
            <button type="button" className="option btn btn-link" onClick={lockWallet}>
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" fixedWidth />
              <p className="icon-label">Lock Account</p>
            </button>
          </div>
        </div>
        <div className="field no-unit-field">
          <select id="network-input" name="network">
            <option>Main Ethereum Network</option>
          </select>
        </div>
      </div>

      <div id="total" className="m-2">
        <h1>
          {ethers.utils.formatEther(currentETH)}
          {' '}
          ETH
        </h1>
        <h2>
          {currentETHAsUSD.toFixed(2)}
          {' '}
          USD
        </h2>
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
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Destination</th>
              <th scope="col">Amount</th>
              <th scope="col">{' '}</th>
            </tr>
          </thead>
          <tbody>
            {
              transactionList.map((transaction: TransactionEntry) => (
                <tr>
                  <th scope="row">{transaction.type}</th>
                  <th>{transaction.date}</th>
                  <th>{transaction.destination}</th>
                  <th>{transaction.amount}</th>
                  <th>
                    <div className="transcation-options">
                      <CancelModal />
                      <button
                        type="button"
                        className="mx-1 btn btn-primary"
                        onClick={() => onReplaceTransaction(transaction.nonce,
                          String(transaction.destination), transaction.amount)}
                      >
                        Replace
                      </button>
                    </div>
                  </th>
                </tr>
              ))
            }
          </tbody>
        </table>
        <Link to="/CreateTransaction">
          <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="3x" />
          <p>Send</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
