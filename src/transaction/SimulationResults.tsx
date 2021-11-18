/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import {
  Link, NavigateFunction, useLocation, useNavigate,
} from 'react-router-dom';
import React, { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faFire, faCheckCircle, faEdit, faTimesCircle,
// } from '@fortawesome/free-solid-svg-icons';
import {
  faFire, faEdit, faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import Modal from 'react-bootstrap/Modal';

import './SimulationResults.scss';
import {
  BigNumber, ethers, Wallet,
} from 'ethers';
import { BackgroundWindowInterface } from 'background/background';
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import browser from 'webextension-polyfill';
import { TransactionResponse } from '@ethersproject/providers';
import SimulationSendTransactions from '../SimulationSendTransactions';

/**
 * Get the object that can simulate and send a transaction
 * @returns the object to simulate and send transactions
 */
async function getTransactionController() {
  const window: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const state = window.stateObj;
  const provider = state.provider as Provider;
  const transactionController: SimulationSendTransactions = new
  SimulationSendTransactions(provider);

  return transactionController;
}

/**
 * Grabs the user's wallet
 * @returns the wallet object from wallet state
 */
async function grabWallet() {
  const window: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const state = window.stateObj;
  const wallet = await state.walletState.getWallet() as Wallet;
  return wallet;
}

/**
 * Grabs the wallet's provider
 * @returns the provider from wallet state
 */
// async function getProvider() {
//   const window: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
//   const state = window.stateObj;
//   const provider = state.provider as Provider;
//   return provider;
// }

/**
 * Returns true by checking if all simulation checks passed
 * @param simulationChecks simulation checks with simulation check as key and boolean as value
 * @returns true if simulationChecks match the function description
 */
function areAllSimulationsPassed(simulationChecks:Map<string, Boolean>):Boolean {
  let ret = true;
  simulationChecks.forEach((value: Boolean) => {
    if (!value) {
      ret = false;
    }
  });

  return ret;
}

const App = (props:
{ t:
{
  gasLimit: any;
  maxFeePerGas: ethers.BigNumberish;
  maxPriorityFeePerGas: ethers.BigNumberish;
};
onClose:
(arg0:
{
  simulationChecks: Map<string, Boolean>; t: ethers.providers.TransactionRequest;
})
=>
void; }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = async (hasEditedGas: Boolean) => {
    if (hasEditedGas) {
      // reassign parameters related to gas for transaction
      const tRequest = props.t;
      tRequest.gasLimit = BigNumber.from((document.getElementById('gasLimit') as HTMLInputElement).value);
      tRequest.maxFeePerGas = ethers.utils.parseUnits((document.getElementById('mfpg') as HTMLInputElement).value, 'gwei');
      tRequest.maxPriorityFeePerGas = ethers.utils.parseUnits((document.getElementById('mpfpg') as HTMLInputElement).value, 'gwei');

      const transactionController = await getTransactionController();
      const wallet = await grabWallet();
      const checksAndTx = await transactionController.simulateTransaction(tRequest, wallet);
      const passedAllSimulations = areAllSimulationsPassed(checksAndTx.simulationChecks);
      if (passedAllSimulations) {
        props.onClose(checksAndTx);
        // TODO: Fix - have to have modal pass data back to the simulation results component
        // Updating page from resimulations
        setIsOpen(false);
      } else {
        // TODO: Need banner, notification, or snackbar indicating failed simulation checks
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <FontAwesomeIcon className="fa-icon" icon={faEdit} onClick={showModal} cursor="pointer" />
      <Modal show={isOpen} onHide={() => hideModal(false)}>
        <Modal.Header>
          <div id="max-tx-fee">
            <h3>
              <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" color="#489aca" />
              {' '}
              Adjust Gas
            </h3>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <div className="form-group">
              <label className="form-label mt-4" htmlFor="gas-limit"> Gas Limit</label>
              <div className="input-group mb-3">
                <input id="gasLimit" type="text" className="form-control" placeholder={BigNumber.from(props.t.gasLimit).toString()} />
              </div>
              <label className="form-label mt-4" htmlFor="gas-limit"> Max fee per gas</label>
              <div className="input-group mb-3">
                <input
                  id="mfpg"
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                  placeholder={ethers.utils.formatUnits(props.t.maxFeePerGas, 'gwei')}
                />
                <span className="input-group-text">Gwei</span>
              </div>
              <label className="form-label mt-4" htmlFor="gas-limit"> Max priority fee per gas</label>
              <div className="input-group mb-3">
                <input
                  id="mpfpg"
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                  placeholder={ethers.utils.formatUnits(props.t.maxPriorityFeePerGas, 'gwei')}
                />
                <span className="input-group-text">Gwei</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={() => hideModal(false)}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={() => hideModal(true)}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/**
 * Creates HTML elements for all simulation checks
 * @param simulationChecks simulation checks with simulation check as key and boolean as value
 */
function createSimulationElements(simulationChecks:Map<string, Boolean>) {
  const arr: [string, Boolean][] = [];
  simulationChecks.forEach((value: Boolean, key: string) => {
    arr.push([key, value]);
  });

  return arr;
}

function SimulationResults() {
  const navigate: NavigateFunction = useNavigate();
  const onSendTransaction = async (txReq: TransactionRequest) => {
    const wallet = await grabWallet();
    try {
      const tResp: TransactionResponse = await wallet.sendTransaction(txReq);
      // Should not be navigating to home like this and passing the state of the
      // response like this because if the same method of grabbing the state
      // is done, then I would need some sort of global state boolean
      // that recognizes when a transaction has been sent in order to
      // properly update the home page
      navigate('/Home', { state: { tResp } });
    } catch (e) {
      // TODO: Probably want this as a little banner, notification, or snackbar
      throw new Error(String(e));
    }
  };

  const { simulationChecks } = useLocation().state;
  const { txReq } = useLocation().state;
  const { contractOrEOA } = useLocation().state;

  // eslint-disable-next-line max-len
  const [simulationElements, setSimulationElements]: [[string, Boolean][], (simulationElements: [string, Boolean][]) => void ] = React.useState<[string, Boolean][]>([]);

  useEffect(() => {
    setSimulationElements(createSimulationElements(simulationChecks));
  }, []);

  // createSimulationElements(simulationChecks);

  // Labels/Variables to populate info on page

  let source = txReq.from;
  source = source.substring(0, 7).concat('...'.concat(source.substring(source.length - 3, source.length)));
  let dest = txReq.to;
  dest = dest.substring(0, 7).concat('...'.concat(dest.substring(dest.length - 3, dest.length)));

  const sourceToDest = source.concat(' to '.concat(dest));
  let transferLabel: string;
  if (contractOrEOA === '0x') {
    transferLabel = 'Basic Transfer';
  } else {
    transferLabel = 'Contract Interaction';
  }

  const tAmount = ethers.utils.formatEther(txReq.value).concat(' ETH');
  let gasLimit = 'Gas Limit: '.concat((BigNumber.from(txReq.gasLimit)).toString().concat('; Max Gas Fee'));
  let totalGasFee = SimulationSendTransactions.totalGasFeeInETH(txReq)?.concat(' ETH');
  let totalTransactionFee = SimulationSendTransactions.totalTransactionFeeInETH(txReq)?.concat(' ETH');

  let simulationStatus = 'Simulation Successful!';
  if (!areAllSimulationsPassed(simulationChecks)) {
    simulationStatus = 'Simulation Failed!';
  }

  function handleClose(checksAndTx:any) {
    const { t } = checksAndTx;
    // TODO: update simulation checks

    // update gas limit, max fee per gas, max priority fee per gas
    gasLimit = 'Gas Limit: '.concat((BigNumber.from(t.gasLimit)).toString().concat('; Max Gas Fee'));
    totalGasFee = SimulationSendTransactions.totalGasFeeInETH(t)?.concat(' ETH');
    totalTransactionFee = SimulationSendTransactions.totalTransactionFeeInETH(t)?.concat(' ETH');
  }

  return (
    <div id="simulation-results">
      <div className="card border-info mb-3">
        <div className="card-body">
          <h3 className="card-title">Transaction Details</h3>
          <p className="card-text">
            <div id="top-box">
              <p>{sourceToDest}</p>
              <p><b>{transferLabel}</b></p>
              {/* <p><b>Contract Interaction</b></p> */}
              <div id="transaction-details">
                <div id="amount">
                  <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="2x" />
                  <p>
                    Sent to &quot;
                    {dest}
                    &quot;
                    <h3>
                      {' '}
                      {tAmount}
                      {' '}
                    </h3>
                  </p>
                </div>
                <div id="max-tx-fee">
                  <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" />
                  <p>
                    {gasLimit}
                    <h3>
                      {' '}
                      {totalGasFee}
                      {' '}
                    </h3>
                  </p>
                  <App
                    t={txReq}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClose={handleClose}
                  />
                </div>
                <div id="total-fee">
                  <p>
                    Total Fee to Send Transaction
                    <h3>
                      {' '}
                      {totalTransactionFee}
                      {' '}
                    </h3>
                  </p>
                </div>
              </div>
            </div>
          </p>
        </div>
      </div>

      <div id="simulation-text"><h1>{simulationStatus}</h1></div>

      <div>
        {simulationElements.map(([simulationCheck, passed]) => (passed ? (
          <div>
            <FontAwesomeIcon icon={faCheckCircle} />
            {simulationCheck}
          </div>
        ) : (
          <div>
            <FontAwesomeIcon icon={faTimesCircle} />
            {simulationCheck}
          </div>
        )))}
      </div>
      {/* <table className="table table-hover">
        <tbody id="simulation-table"> */}
      {/* <tr className="table-secondary">
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Known Token
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Gas: 40,190 (87.1% of limit)
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Tx fee: 0.003580 ETH
            </td>
          </tr>
          <tr className="table-secondary">
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Sufficient ETH for gas fee
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Token sent to non-contract address
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Reasonable gas price
            </td>
          </tr> */}
      {/* </tbody>
      </table> */}

      {/* <h1> </h1>
      <h3>Token Transfers</h3>
      <p>
        0x51092...094ef to
        {' '}
        <b>James Augsten</b>
        {' '}
        for 1 ETH
        {' '}
      </p> */}
      <div id="bottom-buttons">
        <Link to="/Home">
          <button type="button" className="btn btn-primary">Reject Transaction</button>
        </Link>

        <Link to="/CreateTransaction">
          <button type="button" className="btn btn-primary">Edit Transaction</button>
        </Link>

        <Link to="/Home">
          <button type="button" className="btn btn-success" onClick={() => onSendTransaction(txReq)}>Send Transaction</button>
        </Link>
      </div>
    </div>
  );
}

export default SimulationResults;
