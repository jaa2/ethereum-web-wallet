/* eslint-disable no-param-reassign */
import { BigNumber, ethers, Wallet } from 'ethers';
import React, { useEffect } from 'react';
import {
  Link, Location, NavigateFunction, useLocation, useNavigate,
} from 'react-router-dom';
import browser from 'webextension-polyfill';

import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faArrowCircleLeft, faCog,
} from '@fortawesome/free-solid-svg-icons';

import { BackgroundWindowInterface } from '../../background/background';
import AddressBox from '../common/AddressBox';
import UserState from '../common/UserState';
import HelpModal, { IHelpModalProps } from '../common/HelpModal';
import LoadingButton, { ILoadingButtonProps } from '../common/LoadingButton';
import SimulationSendTransactions from '../SimulationSendTransactions';
import SimulationSuite from '../SimulationSuite';
import currentETHtoUSD from '../common/UnitConversion';
import './CreateTransaction.scss';

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
) {
  addressElem.style.borderColor = 'transparent';
  amountElem.style.borderColor = 'transparent';
  const addressInput = addressElem.value;
  const amountInput = amountElem.value;

  const txReq : TransactionRequest = {
    to: addressInput,
  };

  const amountRegex = /^([1-9]\d*|0)((\.\d+)?)$/;

  const isAddressValid = await SimulationSuite.isAddressValid(txReq);
  const isAmountValid = amountRegex.test(amountInput);
  if (isAddressValid && isAmountValid) {
    const window: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const state = window.stateObj;
    const provider = state.provider as Provider;
    const wallet = await state.walletState.getWallet() as Wallet;
    const transactionController: SimulationSendTransactions = new
    SimulationSendTransactions(provider);

    document.getElementById('amount-in-usd')!.innerHTML = (await currentETHtoUSD(provider, +amountInput)).toString().concat(' USD');
    if (wallet !== null) {
      // finish creating create transaction request object
      if (location.state !== null
        && (location.state.nonce !== undefined && location.state.nonce !== null)) {
        txReq.nonce = location.state.nonce;
      }

      txReq.value = ethers.utils.parseEther(amountInput);
      txReq.from = await wallet.getAddress();
      txReq.data = '0x';
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
  }

  // TODO: Have some sort of immediate feeback given to the user that informs
  // them that something wrong was given. onChange, onFocus, onSubmit?
  if (!isAddressValid) {
    addressElem.style.border = '5px solid #ff0000';
  }

  if (!isAmountValid) {
    amountElem.style.border = '5px solid #ff0000';
  }

  return null;
}

interface TransactionAction {
  action: String
}

const CreateTransaction = function CreateTransaction(props: TransactionAction) {
  const location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const [testButtonEnabled, setTestButtonEnabled]:
  [boolean, (state: boolean) => void] = React.useState<boolean>(true);

  const onTestTransaction = async () => {
    setTestButtonEnabled(false);
    const addressElem = (document.getElementById('toAddress') as HTMLInputElement);
    const amountElem = (document.getElementById('amount') as HTMLInputElement);
    const validatedTransaction = await TestTransaction(addressElem, amountElem, location);

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

  let { action } = props;

  let dest = '';
  let tAmount = '';
  if (location.state !== null) {
    if (location.state.txReq !== undefined && location.state.txReq !== null) {
      dest = location.state.txReq.to;
      tAmount = ethers.utils.formatEther(BigNumber.from(location.state.txReq.value).toString());
    } else if ((location.state.nonce !== undefined && location.state.nonce !== null)
    && (location.state.dest !== undefined && location.state.dest !== null)
    && (location.state.amount !== undefined && location.state.amount !== null)) {
      dest = location.state.dest;
      tAmount = location.state.amount;
      action = 'Replace';
    }
  }

  const [address, setAddress]:
  [string, (matchState: string) => void] = React.useState<string>('0x510928a823b892093ac83904ef');

  useEffect(() => {
    UserState.getAddress().then((newAddress) => {
      if (newAddress !== null) {
        setAddress(newAddress);
      }
    });
  }, []);

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
          <img src="/avatar.png" alt="avatar" className="avatar" />
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
          <input type="text" className="form-control" defaultValue={dest} id="toAddress" />
        </div>
        <div className="form-group">
          <label htmlFor="amount" className="form-label mt-4">Amount</label>
          <div className="form-group">
            <div className="input-group mb-3">
              <input type="text" className="form-control" id="amount" defaultValue={tAmount} aria-label="Amount" />
              <span className="input-group-text">ETH</span>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="currency-conversion">
            <h5 id="amount-in-usd">USD</h5>
          </div>
        </div>
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
    </div>
  );
};

export default CreateTransaction;
