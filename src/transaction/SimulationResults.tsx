/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import {
  BigNumber, BigNumberish, ethers,
} from 'ethers';
import React, { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
  Link, NavigateFunction, useLocation, useNavigate,
} from 'react-router-dom';
import browser from 'webextension-polyfill';

import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { TransactionResponse } from '@ethersproject/providers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire, faEdit, faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import { BackgroundWindowInterface } from '../../background/background';
import HelpModal, { IHelpModalProps } from '../common/HelpModal';
import LoadingButton, { ILoadingButtonProps } from '../common/LoadingButton';
import SimulationSendTransactions from '../SimulationSendTransactions';
import UserState from '../common/UserState';
// import WalletState from '../../background/WalletState';

import './SimulationResults.scss';

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

const GasOptions = function GasOptions(props:
{ t:
{ gasLimit: any;
  maxFeePerGas: ethers.BigNumberish;
  maxPriorityFeePerGas: ethers.BigNumberish;
};
modalToSimulationResults: (arg0: ethers.providers.TransactionRequest,
  arg1: Map<string, Boolean>) => void; }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = async (hasEditedGas: Boolean) => {
    if (hasEditedGas) {
      const gasLimitElem = document.getElementById('gasLimit') as HTMLInputElement;
      const mfpgElem = document.getElementById('mfpg') as HTMLInputElement;
      const mpfpgElem = document.getElementById('mpfpg') as HTMLInputElement;

      gasLimitElem.style.borderColor = 'transparent';
      mfpgElem.style.borderColor = 'transparent';
      mpfpgElem.style.borderColor = 'transparent';

      // reassign parameters related to gas for transaction
      const gasLimitValue = gasLimitElem.value;
      const mfpgValue = mfpgElem.value;
      const mpfpgValue = mpfpgElem.value;

      // Note: The rest of the checks to check if the gas limit and gas fees are enough
      // are done upon simulation
      const gasLimitRegex = /^[1-9]\d*$/;
      const gasFeesRegex = /^([1-9]\d*|0)((\.\d+)?)$/;

      // This is to just check how the values are written
      const isValidGasLimit = gasLimitRegex.test(gasLimitValue);
      const isValidMfpg = gasFeesRegex.test(mfpgValue);
      const isValidMpfpg = gasFeesRegex.test(mpfpgValue);

      if (isValidGasLimit && isValidMfpg && isValidMpfpg) {
        const tRequest = props.t;
        tRequest.gasLimit = BigNumber.from(gasLimitValue);
        tRequest.maxFeePerGas = ethers.utils.parseUnits(mfpgValue, 'gwei');
        tRequest.maxPriorityFeePerGas = ethers.utils.parseUnits(mpfpgValue, 'gwei');

        const transactionController = await getTransactionController();
        const wallet = await UserState.getConnectedWallet();
        const checksAndTx = await transactionController.simulateTransaction(tRequest, wallet);
        // TODO: fix gas-related simulation tests and then replace true with passedAllSimulations
        const passedAllSimulations = areAllSimulationsPassed(checksAndTx.simulationChecks);
        // console.log(passedAllSimulations);
        if (passedAllSimulations) {
          props.modalToSimulationResults(checksAndTx.t, checksAndTx.simulationChecks);
          setIsOpen(false);
        } else {
          // TODO: Need banner, notification, or snackbar indicating failed simulation checks
          // If any of the gas simulations fail, outline input with red border to indicate
          // that the parameter is not reasonable
          let hasWrongGasParam = false;

          checksAndTx.simulationChecks.forEach((value: Boolean, key: string) => {
            const check = key.toLowerCase();
            if (check.includes('gas') && check.includes('limit')) {
              if (value === false) {
                gasLimitElem.style.border = '5px solid #ff0000';
                hasWrongGasParam = true;
              }
            }

            if (check.includes('gas') && check.includes('price')) {
              if (value === false) {
                mfpgElem.style.border = '5px solid #ff0000';
                mpfpgElem.style.border = '5px solid #ff0000';
                hasWrongGasParam = true;
              }
            }
          });

          if (hasWrongGasParam) {
            // Resimulation would have happened, but if there was a bad gas parameter,
            // then the modal stays up
            setIsOpen(true);
          } else {
            // This will drop the modal and reupdate the page with all of the new fees
            // and simulation checks
            props.modalToSimulationResults(checksAndTx.t, checksAndTx.simulationChecks);
            setIsOpen(false);
          }
        }
      } else {
        if (!isValidGasLimit) {
          gasLimitElem.style.border = '5px solid #ff0000';
        }

        if (!isValidMfpg) {
          mfpgElem.style.border = '5px solid #ff0000';
        }

        if (!isValidMpfpg) {
          mpfpgElem.style.border = '5px solid #ff0000';
        }

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
                <input id="gasLimit" type="text" className="form-control" defaultValue={BigNumber.from(props.t.gasLimit).toString()} />
              </div>
              <label className="form-label mt-4" htmlFor="gas-limit"> Max fee per gas</label>
              <div className="input-group mb-3">
                <input
                  id="mfpg"
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                  defaultValue={ethers.utils.formatUnits(props.t.maxFeePerGas, 'gwei')}

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
                  defaultValue={ethers.utils.formatUnits(props.t.maxPriorityFeePerGas, 'gwei')}
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

const SimulationResults = function SimulationResults() {
  const navigate: NavigateFunction = useNavigate();

  const [sendButtonEnabled, setSendButtonEnabled]:
  [boolean, (state: boolean) => void] = React.useState<boolean>(true);

  const { originRequestId } = useLocation().state;

  const onSendTransaction = async (txReq: TransactionRequest) => {
    setSendButtonEnabled(false);
    const pendingTxStore = await UserState.getPendingTxStore();
    try {
      const wallet = await UserState.getConnectedWallet();
      if (wallet === null) {
        const toastMsg = document.getElementById('toast-message');
        toastMsg!.textContent = "Couldn't connect to wallet. Try resending the transaction.";

        const toast = document.getElementById('errToast');
        toast!.className = 'toast show';
        setTimeout(() => {
          toast!.className = 'toast hide';
        }, 3000);
      } else {
        try {
          const tResp: TransactionResponse = await wallet.sendTransaction(txReq);
          await pendingTxStore.addPendingTransaction(tResp, true);

          // Send sendTransaction response to background
          browser.runtime.sendMessage(undefined, {
            type: 'sendTransactionResponse',
            data: {
              originRequestId,
              hash: tResp.hash,
            },
          });

          navigate('/Home');
        } catch (err:any) {
          let errMsg = err.message;

          const toastMsg = document.getElementById('toast-message');
          const i = errMsg.indexOf('(');
          if (errMsg.includes('bad response')) {
            toastMsg!.textContent = 'The simulation ran into a network error. Please try testing the transaction again.';
          } else if (i !== -1) {
            errMsg = errMsg.substring(0, i - 1);
            errMsg = errMsg[0].toUpperCase().concat(errMsg.substring(1));
            toastMsg!.textContent = errMsg;
          } else {
            errMsg = errMsg[0].toUpperCase().concat(errMsg.substring(1));
            toastMsg!.textContent = errMsg;
          }

          const toast = document.getElementById('errToast');
          toast!.className = 'toast show';
          setTimeout(() => {
            toast!.className = 'toast hide';
          }, 3000);
        }
      }
    } catch (e:any) {
      let errMsg = e.message;

      const toastMsg = document.getElementById('toast-message');
      const i = errMsg.indexOf('(');
      if (errMsg.includes('bad response')) {
        toastMsg!.textContent = 'The simulation ran into a network error. Please try testing the transaction again.';
      } else if (i !== -1) {
        errMsg = errMsg.substring(0, i - 1);
        errMsg = errMsg[0].toUpperCase().concat(errMsg.substring(1));
        toastMsg!.textContent = errMsg;
      } else {
        errMsg = errMsg[0].toUpperCase().concat(errMsg.substring(1));
        toastMsg!.textContent = errMsg;
      }

      const toast = document.getElementById('errToast');
      toast!.className = 'toast show';
      setTimeout(() => {
        toast!.className = 'toast hide';
      }, 3000);
    }
  };

  const gasModalProps: IHelpModalProps = {
    title: 'Gas Terms',
    description: 'Gas price - maximum amount of Ether you are willing to pay for each unit of Gas. Gas limit - maximum amount of gas you are willing to spend to execute the transaction. Gwei - fractional unit of Ether used to specify gas price.',
  };

  const onEditTransaction = (txReq: TransactionRequest) => {
    navigate('/CreateTransaction', { state: { txReq } });
  };

  const onCloseToast = () => {
    const toast = document.getElementById('errToast');
    toast!.className = 'toast hide';
  };

  // TODO: Create interface for passing data to and from simulation checks
  const { simulationChecks } = useLocation().state as any;
  const txReq = (useLocation().state as any).txReq as any;
  const { contractOrEOA } = useLocation().state as any;

  // eslint-disable-next-line max-len
  const [simulationElements, setSimulationElements]: [[string, Boolean][], (simulationElements: [string, Boolean][]) => void ] = React.useState<[string, Boolean][]>([]);
  useEffect(() => {
    setSimulationElements(createSimulationElements(simulationChecks));
  }, []);

  const [data, setData]: [[TransactionRequest, Map<string, Boolean>],
    // eslint-disable-next-line max-len
    (data: [TransactionRequest, Map<string, Boolean>]) => void ] = React.useState([txReq, simulationChecks]);

  const modalToSimulationResults = (
    t: ethers.providers.TransactionRequest,
    simChecks: Map<string, Boolean>,
  ) => {
    setData([t, simChecks]);
  };

  // Labels/Variables to populate info on page

  let source = String(data[0].from);
  source = source.substring(0, 7).concat('...'.concat(source.substring(source.length - 3, source.length)));
  let dest = String(data[0].to);
  dest = dest.substring(0, 7).concat('...'.concat(dest.substring(dest.length - 3, dest.length)));

  const sourceToDest = source.concat(' to '.concat(dest));
  let transferLabel: string;
  if (contractOrEOA === '0x') {
    transferLabel = 'Basic Transfer';
  } else {
    transferLabel = 'Contract Interaction';
  }

  const tAmount = ethers.utils.formatEther(data[0].value as BigNumberish).concat(' ETH');
  const maxGasFeeTitle = 'Max Gas Fee';
  const totalGasFee = SimulationSendTransactions.totalGasFeeInETH(data[0])?.concat(' ETH');
  const totalTransactionFee = SimulationSendTransactions.totalTransactionFeeInETH(data[0])?.concat(' ETH');

  let simulationStatus = 'Simulation Successful!';
  if (!areAllSimulationsPassed(simulationChecks)) {
    simulationStatus = 'Simulation Failed!';
  }

  const loadingSendButtonProps: ILoadingButtonProps = {
    buttonId: 'send-button',
    buttonClasses: areAllSimulationsPassed(simulationChecks)
      ? ['btn', 'btn-success']
      : ['btn', 'btn-primary'],
    buttonText: 'Send',
    buttonOnClick: () => onSendTransaction(data[0]),
    buttonEnabled: sendButtonEnabled,
  };

  return (
    <div id="simulation-results">
      <div className="card border-info mb-3">
        <div className="card-body">
          <div id="top-box">
            <h3 className="card-title">Transaction Details</h3>
            <p className="card-text">
              <p>{sourceToDest}</p>
              <p>{transferLabel}</p>
              {/* <p><b>Contract Interaction</b></p> */}
              <div id="transaction-details">
                <div id="amount">
                  <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="2x" />
                  <p>
                    Amount
                    <h5>
                      {tAmount}
                    </h5>
                  </p>
                </div>
                <div id="max-tx-fee">
                  <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" />
                  <p>
                    {maxGasFeeTitle}
                    <h5>
                      {totalGasFee}
                    </h5>
                  </p>
                  <GasOptions
                    t={txReq}
                    modalToSimulationResults={modalToSimulationResults}
                  />
                </div>
                <HelpModal
                  title={gasModalProps.title}
                  description={gasModalProps.description}
                />
              </div>
              <div id="total-fee">
                <p>
                  <h4>
                    Total Cost:
                    {' '}
                    {totalTransactionFee}
                    {' '}
                  </h4>
                </p>
              </div>
            </p>
          </div>
        </div>
      </div>

      <div id="simulation-text"><h1>{simulationStatus}</h1></div>

      <div className="checklist">
        {simulationElements.map(([simulationCheck, passed]) => (passed ? (
          <div className="item">
            <FontAwesomeIcon icon={faCheckCircle} color="#6cbc7a" />
            {simulationCheck}
          </div>
        ) : (
          <div>
            <FontAwesomeIcon icon={faTimesCircle} color="#ca5c54" />
            {simulationCheck}
          </div>
        )))}
      </div>
      <h6>{' '}</h6>
      <h6>{' '}</h6>
      <div id="bottom-buttons">
        <Link to="/Home">
          <button type="button" className="btn btn-primary">Reject</button>
        </Link>

        <button type="button" className={(areAllSimulationsPassed(simulationChecks) ? 'btn btn-primary' : 'btn btn-info')} onClick={() => onEditTransaction(data[0])}>Edit</button>

        <LoadingButton {...loadingSendButtonProps} /> {/* eslint-disable-line */}
      </div>
      <div className="position-fixed bottom-0 end-0 p-3" data-style="z-index:11">
        <div className="toast hide" id="errToast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">
              Something went wrong
            </strong>
            <button type="button" onClick={onCloseToast} className="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close">
              <span aria-hidden="true" />
            </button>
          </div>
          <div id="toast-message" className="toast-body" />
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
