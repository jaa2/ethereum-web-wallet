/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  BigNumber, ethers, Signer,
} from 'ethers';
import React, { ReactElement, useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import browser from 'webextension-polyfill';

import { EtherscanProvider, TransactionRequest, TransactionResponse } from '@ethersproject/providers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faLock, faPaperPlane, faUserCircle, faExternalLinkAlt, /* faExchangeAlt, */
} from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

import PendingTransactionStore from 'background/PendingTransactionStore';
import { BackgroundWindowInterface } from '../background/background';
import { getCancelTransaction } from './common/TransactionReplacement';
import { UserAddressBox } from './common/AddressBox';
import HelpModal, { IHelpModalProps } from './common/HelpModal';
import OpenNewWindow from './common/OpenNewWindow';
import UserState from './common/UserState';

import './Home.scss';
import WalletState from '../background/WalletState';
import currentETHtoUSD from './common/UnitConversion';
import SimulationSuite from './SimulationSuite';
import ProviderSelect from './common/ProviderSelect';

const CancelModal = function CancelModal(props: { oldTx: TransactionResponse }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [feeToCancel, setFeeToCancel] = React.useState(BigNumber.from(0));

  const showModal = () => {
    setIsOpen(true);
    const { oldTx } = props;
    const cancelTx = getCancelTransaction(oldTx);
    setFeeToCancel(SimulationSuite.getTransactionMaxFee(cancelTx));
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const sendCancelTx = async () => {
    try {
      // Create cancel transaction
      const { oldTx } = props;
      const cancelTx: TransactionRequest = getCancelTransaction(oldTx);
      // Send cancel transaction
      const pendingTxStore = await UserState.getPendingTxStore();
      const wallet = await UserState.getConnectedWallet();
      const tResp: TransactionResponse = await wallet.sendTransaction(cancelTx);
      await pendingTxStore.addPendingTransaction(tResp, true);
    } finally { // TODO: Catch error and display as notification to user
      // Hide the modal
      hideModal();
    }
  };

  let feeToCancelElement = <div />;

  if (feeToCancel.gt(0)) {
    feeToCancelElement = (
      <p>
        Estimated gas fee to cancel:
        {' '}
        {ethers.utils.formatEther(feeToCancel)}
        {' '}
        ETH
      </p>
    );
  }

  return (
    <>
      <button type="button" className="mx-1 btn btn-primary" onClick={showModal}>Cancel</button>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          Cancel Transaction
        </Modal.Header>
        <Modal.Body>
          {feeToCancelElement}
          <p>
            Are you sure you want to cancel this transaction?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={hideModal}>Close</button>
          <button type="button" className="btn btn-primary" onClick={sendCancelTx}>Confirm</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/**
 * Takes user's transaction history and transforms it into a form that can be rendered in a table
 * @param rawTransactions Unfiltered transaction response data
 * @param selfAddress Address of the current user
 * @param limit Number of elements to return
 * @returns Table ready transaction history
 */
const GetTableTransactions = (
  rawTransactions: Array<TransactionResponse>,
  selfAddress: string,
  limit: number,
) => {
  // using reduce() to filter for unique transactions by their hash
  // loosely based on https://stackoverflow.com/questions/51908601/how-to-get-unique-array-of-objects-filtering-by-object-key
  const uniqueTransactions: Array<TransactionResponse> = Array.from(
    rawTransactions.reduce((
      mapping: Map<string, TransactionResponse>,
      transaction: TransactionResponse,
    ) => {
      if (!mapping.has(transaction.hash)) {
        mapping.set(transaction.hash, transaction);
      }
      return mapping;
    }, new Map<string, TransactionResponse>()).values(),
  );

  const transactionList: Array<TransactionEntry> = [];
  for (let i = 0; i < uniqueTransactions.length; i += 1) {
    // Find the date the transaction was included, if available
    let date:string = '';
    const { timestamp } = uniqueTransactions[i];
    if (timestamp !== undefined) {
      date = (new Date(timestamp * 1000)).toLocaleString();
    }
    // Find the transaction type (IN or OUT) - Etherscan only
    let type = 'OUT';

    // checking for SELF transactions
    if (uniqueTransactions[i].to === uniqueTransactions[i].from) {
      type = 'SELF';
    } else if (uniqueTransactions[i].to === selfAddress
      && uniqueTransactions[i].from !== selfAddress) {
      type = 'IN';
    }
    transactionList.push({
      type,
      nonce: uniqueTransactions[i].nonce,
      date,
      destination: uniqueTransactions[i].to,
      amount: ethers.utils.formatEther(uniqueTransactions[i].value),
      hash: uniqueTransactions[i].hash,
    });
  }

  return transactionList.slice(0, limit);
};

/**
 * Gets a link to an explorer's page containing a transaction
 * @param explorerURL Base explorer URL, without trailing slash
 * @param txHash Transaction hash
 * @returns A ReactElement containing a link to the transaction in the explorer
 */
function getExplorerTxLink(explorerURL: string, txHash: string): ReactElement {
  return <a href={`${explorerURL}/tx/${txHash}`} target="_blank" rel="noreferrer">View</a>;
}

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
  amount: string,
  // Transaction hash
  hash: string;
}

const AddressTruncate = (address: string | undefined | null) => {
  if (address === undefined) {
    return '';
  }
  if (address === null) {
    return '[Contract Deployment]';
  }

  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const Home = function Home() {
  const [currentTransactions, setCurrentTransactions]:
  [Array<TransactionResponse>, (responses: Array<TransactionResponse>) => void] = React.useState<
  Array<TransactionResponse>
  >(Array<TransactionResponse>());
  const [pendingTransactions, setPendingTransactions]:
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
  const [explorerURL, setExplorerURL]: [string, (url: string) => void] = React.useState<string>('');

  useEffect(() => {
    UserState.getBackgroundWindow()
      .then((window) => window.stateObj.selectedNetwork)
      .then((providerNetwork) => (providerNetwork === undefined ? Promise.reject()
        : providerNetwork))
      .then((providerNetwork) => (providerNetwork.explorerURL === undefined
        ? Promise.reject() : providerNetwork.explorerURL))
      .then((newExplorerURL) => setExplorerURL(newExplorerURL));

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
      .then((provider) => currentETHtoUSD(provider))
      .then((valInUSD) => {
        setCurrentETHValue(valInUSD);
      });

    UserState.getPendingTxStore().then((response : PendingTransactionStore) => {
      setPendingTransactions(response.pendingTransactions);
      UserState.getProvider().then((provider) => {
        provider?.on('block', () => {
          const resPendingTransactions = response.pendingTransactions;
          for (let i = 0; i < resPendingTransactions.length; i += 1) {
            const txHash = resPendingTransactions[i].hash;
            provider.getTransaction(txHash)
              .then((res: TransactionResponse) => {
                if (res !== null && res.blockNumber !== null) {
                  const newCurrentTransactionsList = currentTransactions.slice(0);
                  newCurrentTransactionsList.push(res);
                  setCurrentTransactions(newCurrentTransactionsList);
                  setPendingTransactions(pendingTransactions.filter((tx) => (tx.hash !== txHash)));
                }
              });
          }
        });
      });
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

  const transactionList: Array<TransactionEntry> = GetTableTransactions(
    currentTransactions,
    address,
    10,
  );
  const pendingTransactionList: Array<TransactionEntry> = GetTableTransactions(
    pendingTransactions,
    address,
    10,
  );

  const onReplaceTransaction = (nonce: number, dest: string, amount: string) => {
    navigate('/CreateTransaction', {
      state: {
        nonce,
        dest,
        amount,
      },
    });
  };
  const networkModalProps: IHelpModalProps = {
    title: 'Network',
    description: 'Multiple networks that support the Ethereum protocol exist, meaning that they each independently maintain their own blockchain. In addition to the main Ethereum network, there are both test networks and private networks. Network switching is currently not supported.',
  };

  return (
    <div id="home">
      <div className="top-bar mb-4">
        <div className="user">
          <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="6x" />
          <div id="home-user-options">
            <div className="option">
              <UserAddressBox />
            </div>
            <button type="button" className="option btn btn-link" onClick={() => navigate('/ProfileSettings')}>
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="1x" fixedWidth />
              <p className="icon-label">Settings</p>
            </button>
            <button type="button" className="option btn btn-link" onClick={lockWallet}>
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" fixedWidth />
              <p className="icon-label">Lock Wallet</p>
            </button>
            <a className="option btn btn-link" href={`${explorerURL}/address/${address}`} target="_blank" rel="noreferrer">
              <FontAwesomeIcon className="fa-icon" icon={faExternalLinkAlt} size="1x" fixedWidth />
              <p className="icon-label">View in Explorer</p>
            </a>
          </div>
        </div>
        <OpenNewWindow />
        <div className="network align-items-center">
          <ProviderSelect />
          <HelpModal title={networkModalProps.title} description={networkModalProps.description} />
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

      {/* <div id="assets" className="m-2">
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
      </div> */}

      <div id="activity" className="m-2">
        <Link to="/CreateTransaction">
          <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="3x" />
          <p>Send</p>
        </Link>
        <label className="form-label" htmlFor="activity-table">Recent Activity</label>
        <table id="activity-table" className="table">
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Date</th>
              <th scope="col">Destination</th>
              <th scope="col">Amount</th>
              <th scope="col">Explorer</th>
            </tr>
          </thead>
          <tbody>
            {
              pendingTransactionList.map((transaction: TransactionEntry) => (
                <>
                  <tr>
                    <th scope="row" rowSpan={2} align="center">
                      {transaction.type}
                    </th>
                    <td>
                      <div>
                        <p>&mdash;</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="history-address" data-toggle="tooltip" title={transaction.destination}>
                          {AddressTruncate(transaction.destination)}
                        </p>
                      </div>
                    </td>
                    <td>{transaction.amount}</td>
                    <td>{getExplorerTxLink(explorerURL, transaction.hash)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <span className="d-flex justify-content-around">
                        <CancelModal oldTx={pendingTransactions.filter(
                          (txResponse) => txResponse.hash === transaction.hash,
                        )[0]}
                        />
                        <button
                          type="button"
                          className="mx-1 btn btn-primary"
                          onClick={() => onReplaceTransaction(
                            transaction.nonce,
                            String(transaction.destination),
                            transaction.amount,
                          )}
                        >
                          Replace
                        </button>
                      </span>
                    </td>
                  </tr>
                </>
              ))
            }
            <tr>
              <th scope="row" />
              <td />
              <td />
              <td />
              <td />
            </tr>
            {
              transactionList.map((transaction: TransactionEntry) => (
                <tr>
                  <th scope="row">{transaction.type}</th>
                  <td>{transaction.date}</td>
                  <td>
                    <p className="history-address" data-toggle="tooltip" title={transaction.destination}>
                      {AddressTruncate(transaction.destination)}
                    </p>
                  </td>
                  <td>{transaction.amount}</td>
                  <td>{getExplorerTxLink(explorerURL, transaction.hash)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
