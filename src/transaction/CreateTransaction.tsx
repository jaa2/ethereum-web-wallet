/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/style-prop-object */
/* eslint-disable no-param-reassign */
import {
  BigNumber, BytesLike, ethers, Wallet,
} from 'ethers';
import React, { useEffect } from 'react';
import {
  Link, Location, NavigateFunction, useLocation, useNavigate,
} from 'react-router-dom';
import browser from 'webextension-polyfill';

import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faArrowCircleLeft, faCog, faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

// import $ from 'jquery';

import { BackgroundWindowInterface } from '../../background/background';
import AddressBox from '../common/AddressBox';
import UserState from '../common/UserState';
import HelpModal, { IHelpModalProps } from '../common/HelpModal';
import LoadingButton, { ILoadingButtonProps } from '../common/LoadingButton';
import SimulationSendTransactions from '../SimulationSendTransactions';
import SimulationSuite from '../SimulationSuite';
import currentETHtoUSD from '../common/UnitConversion';
import './CreateTransaction.scss';
import DataField from './DataField';

interface CreateTransactionLocationState {
  nonce: number | null;
  dest: string | null;
  amount: string | null;
  data: string | null;
  txReq: TransactionRequest | null;
}

/**
 * Gets the background state object
 * @returns background state object
 */
async function getStateObj() {
  const window: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
  const state = window.stateObj;
  return state;
}

/**
 * Ensures that the inputs of address and amount are valid before sending
 * the transaction
 * @param addressInput The destination address of the transaction
 * @param amountInput The amount being sent
 */
async function TestTransaction(
  addressElem: HTMLInputElement,
  amountElem: HTMLInputElement,
  location: Location,
  data: BytesLike | undefined,
) {
  const addressInput = addressElem.value;
  const amountInput = amountElem.value;

  const txReq : TransactionRequest = {
    to: addressInput,
  };

  try {
    // Preventing users from simulating transaction on invalid inputs
    let err = '';
    if (addressElem.className === 'form-control is-invalid' && amountElem.className === 'form-control is-invalid') {
      err = 'Address and amount inputs are invalid. Please fix them before testing the transaction.';
    } else if (addressElem.className === 'form-control is-invalid') {
      err = 'Address input is invalid. Please fix it before testing the transaction.';
    } else if (amountElem.className === 'form-control is-invalid') {
      err = 'Amount input is invalid. Please fix it before testing the transaction';
    }

    if (err !== '') {
      throw new Error(err);
    }

    // At this point, all inputs should be valid to be sent
    const value = ethers.utils.parseEther(amountInput);
    const state = await getStateObj();
    const provider = state.provider as Provider;
    const wallet = await state.walletState.getWallet() as Wallet;
    const transactionController: SimulationSendTransactions = new
    SimulationSendTransactions(provider);

    if (wallet !== null) {
      // finish creating create transaction request object
      const locState = location.state as CreateTransactionLocationState | null;
      if (locState !== null && locState.nonce) {
        txReq.nonce = locState.nonce;
      }

      txReq.value = value;
      txReq.from = await wallet.getAddress();
      txReq.data = data;
      txReq.gasLimit = await transactionController.getGasLimit(txReq);

      // Execute simulations and go to simulations page
      const checksAndTx = await transactionController.simulateTransaction(
        txReq,
        wallet.connect(provider),
      );
      const contractOrEOA = await provider.getCode(addressInput);

      return {
        simulationChecks: checksAndTx.simulationChecks,
        txReq: checksAndTx.t,
        contractOrEOA,
      };
    }

    const toastMsg = document.getElementById('toast-message');
    toastMsg!.textContent = 'You don\'t have an existing wallet to test a transaction.';

    const toast = document.getElementById('errToast');
    toast!.className = 'toast show';
    setTimeout(() => {
      toast!.className = 'toast hide';
    }, 3000);

    return null;
  } catch (e: any) {
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

    return null;
  }
}

function getCurrentETHInUSD(amount: number, ethUsdRate: number) {
  return amount * ethUsdRate;
}

interface TransactionAction {
  action: String
}

const CreateTransaction = function CreateTransaction(props: TransactionAction) {
  const location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const [testButtonEnabled, setTestButtonEnabled]:
  [boolean, (state: boolean) => void] = React.useState<boolean>(true);

  const [address, setAddress]:
  [string, (matchState: string) => void] = React.useState<string>('');
  const [currentETHValue, setCurrentETHValue] = React.useState<number>(0);

  useEffect(() => {
    UserState.getAddress().then((newAddress) => {
      if (newAddress !== null) {
        setAddress(newAddress);
      }
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
  }, []);

  const onTestTransaction = async () => {
    setTestButtonEnabled(false);
    const addressElem = (document.getElementById('toAddress') as HTMLInputElement);
    const amountElem = (document.getElementById('amount') as HTMLInputElement);
    if (addressElem.value === '') {
      const feedbackElem = document.getElementById('to-feedback');
      addressElem.className = 'form-control is-invalid';
      feedbackElem!.textContent = 'Invalid address';
      feedbackElem!.className = 'invalid-feedback';
    }

    if (amountElem.value === '') {
      const feedbackElem = document.getElementById('amt-feedback');
      amountElem.className = 'form-control is-invalid';
      feedbackElem!.textContent = 'Invalid amount';
      feedbackElem!.className = 'invalid-feedback';
    }

    const dataFieldElem = document.getElementById('dataField');
    let data: BytesLike | undefined;
    if (dataFieldElem !== null && dataFieldElem instanceof HTMLTextAreaElement) {
      if (!ethers.utils.isBytesLike(dataFieldElem.value.trim())) {
        // Failed
        setTestButtonEnabled(true);
        return;
      }
      data = dataFieldElem.value.trim();
    }

    const validatedTransaction = await TestTransaction(addressElem, amountElem, location, data);

    if (validatedTransaction) {
      navigate('/SimulationResults', {
        state: {
          simulationChecks: validatedTransaction.simulationChecks,
          txReq: validatedTransaction.txReq,
          contractOrEOA: validatedTransaction.contractOrEOA,
        // eslint-disable-next-line @typescript-eslint/comma-dangle
        }
      });
    } else {
      setTestButtonEnabled(true);
    }
  };

  const onAddressInput = async () => {
    const addressElem = (document.getElementById('toAddress') as HTMLInputElement);
    const txReq : TransactionRequest = {
      to: addressElem.value,
    };

    const isAddressValid = await SimulationSuite.isAddressValid(txReq);
    const feedbackElem = document.getElementById('to-feedback');
    if (!isAddressValid) {
      addressElem.className = 'form-control is-invalid';
      feedbackElem!.textContent = 'Invalid address';
      feedbackElem!.className = 'invalid-feedback';
    } else {
      addressElem.className = 'form-control is-valid';
      feedbackElem!.textContent = '';
      feedbackElem!.className = 'valid-feedback';
    }
  };

  const onAmountInput = () => {
    const amountElem = (document.getElementById('amount') as HTMLInputElement);
    const amountInput = amountElem.value;
    const feedbackElem = document.getElementById('amt-feedback');

    // Initial check to make sure there are no leading 0s (> 1)
    // Ex: Preventing 00001234 --> 1234
    const amountRegex = /^((([1-9]\d*|0)((\.\d+)?))|(\.\d+))$/;

    if (amountRegex.test(amountInput)) {
      try {
        ethers.utils.parseEther(amountInput);
        document.getElementById('amount-in-usd')!.textContent = (getCurrentETHInUSD(+amountInput, currentETHValue)).toFixed(2).concat(' USD');
        amountElem.className = 'form-control is-valid';
        feedbackElem!.textContent = '';
        feedbackElem!.className = 'valid-feedback';
      } catch (e: any) {
        let errMsg = e.message;

        amountElem.className = 'form-control is-invalid';
        if (errMsg.includes('fractional component exceeds')) {
          feedbackElem!.textContent = 'Too many decimal places';
          feedbackElem!.className = 'invalid-feedback';
        } else {
          const i = errMsg.indexOf('(');
          errMsg = errMsg.substring(0, i - 1);
          errMsg = errMsg[0].toUpperCase().concat(errMsg.substring(1));
          feedbackElem!.textContent = errMsg;
          feedbackElem!.className = 'invalid-feedback';
        }
      }
    } else {
      amountElem.className = 'form-control is-invalid';
      feedbackElem!.textContent = 'Invalid amount';
      feedbackElem!.className = 'invalid-feedback';
    }
  };

  const onCloseToast = () => {
    const toast = document.getElementById('errToast');
    toast!.className = 'toast hide';
  };

  let { action } = props;

  let dest = '';
  let tAmount = '';
  let data = '0x';
  const locState = location.state as CreateTransactionLocationState | null;
  if (locState !== null) {
    if (locState.txReq) {
      dest = locState.txReq.to ? locState.txReq.to : dest;
      tAmount = ethers.utils.formatEther(BigNumber.from(locState.txReq.value).toString());
      data = locState.txReq.data ? locState.txReq.data.toString() : data;
    } else if (locState.dest && locState.amount) {
      dest = locState.dest;
      tAmount = locState.amount;
      action = 'Replace';
    }
    if (locState.data) {
      data = locState.data;
    }
  }

  const simulationModalProps: IHelpModalProps = {
    title: 'Simulation',
    description: 'A simulation is a speculative process of taking the inputted parameters of a transaction and showing how it would fare under an ideal scenario. There is no risk nor cost to simulating a transaction.',
  };

  const loadingTestButtonProps: ILoadingButtonProps = {
    buttonId: 'test-button',
    buttonClasses: ['btn', 'btn-info'],
    buttonText: 'Test Transaction',
    buttonOnClick: onTestTransaction,
    buttonEnabled: testButtonEnabled,
  };

  return (
    <div className="transaction-container">
      <div className="top-bar mb-4">
        <div className="user">
          <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="6x" />
          <div id="transaction-user-options">
            <div className="option">
              <AddressBox address={address} />
            </div>
            <button type="button" className="option btn btn-link" onClick={() => navigate('/ProfileSettings')}>
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="1x" fixedWidth />
              <p className="icon-label">Settings</p>
            </button>
          </div>
        </div>
      </div>

      <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="4x" />
      <h1>
        {action}
        {' '}
        Transaction
      </h1>

      <div className="field-entry">
        <div className="form-group">
          <label className="col-form-label mt-4" htmlFor="toAddress">To</label>
          <input type="text" className="form-control" defaultValue={dest} id="toAddress" onChange={() => onAddressInput()} />
          <div id="to-feedback" className="" />
        </div>
        <div className="form-group">
          <label htmlFor="amount" className="form-label mt-4">Amount</label>
          <div className="form-group">
            <div className="input-group mb-3">
              <input type="text" className="form-control" id="amount" defaultValue={tAmount} aria-label="Amount" onChange={onAmountInput} />
              <span className="input-group-text">ETH</span>
              <div id="amt-feedback" className="" />
            </div>
          </div>
        </div>
        <div className="field">
          <div className="currency-conversion">
            <h5 id="amount-in-usd">USD</h5>
          </div>
        </div>
        <DataField initialData={data} />
      </div>
      {action === 'Send'
        && (
        <div className="bottom-options">
          <Link className="back-icon" to="/Home">
            <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
          </Link>
          <span>
            <LoadingButton {...loadingTestButtonProps} /> {/* eslint-disable-line */}
            <HelpModal
              title={simulationModalProps.title}
              description={simulationModalProps.description}
            />
          </span>
        </div>
        )}
      {action === 'Replace'
        && (
        <div className="bottom-options">
          <Link to="/Home">
            <button type="button" className="btn btn-primary">Discard Changes</button>
          </Link>
          <span>
            <LoadingButton {...loadingTestButtonProps} /> {/* eslint-disable-line */}
            <HelpModal
              title={simulationModalProps.title}
              description={simulationModalProps.description}
            />
          </span>
        </div>
        )}
      <div className="position-fixed bottom-0 end-0 p-3" data-style="z-index:1">
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

export default CreateTransaction;
