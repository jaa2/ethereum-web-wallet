/* eslint-disable no-param-reassign */
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faPaperPlane, faQuestionCircle, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';

import './CreateTransaction.scss';
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber, Wallet } from 'ethers';
import { BackgroundWindowInterface } from 'background/background';
import browser from 'webextension-polyfill';
import SimulationSendTransactions from '../SimulationSendTransactions';

/**
 * Ensures that the inputs of address and amount are valid before sending
 * the transaction
 * @param addressInput The destination address of the transaction
 * @param amountInput The amount being sent
 */
async function TestTransaction(addressElem: HTMLInputElement, amountElem: HTMLInputElement) {
  addressElem.style.borderColor = 'inherit';
  amountElem.style.borderColor = 'inherit';
  const addressInput = addressElem.value;
  const amountInput = amountElem.value;

  const addressRegex = /0x[0-9a-f]{1,42}/;
  const amountRegex = /([1-9]\d*|0)(\.\d{1,8})?/;
  const isAddressValid = addressRegex.test(addressInput);
  const isAmountValid = amountRegex.test(amountInput);
  if (isAddressValid && isAmountValid) {
    const window: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const state = window.stateObj;
    const provider = state.provider as Provider;
    const wallet = await state.walletState.getWallet() as Wallet;
    const transactionController: SimulationSendTransactions = new
    SimulationSendTransactions(provider);

    document.getElementById('amount-in-usd')!.innerHTML = (await transactionController.currentETHtoUSD(+amountInput)).toString().concat(' USD');
    if (wallet !== null) {
      // create transaction request object
      const txReq: TransactionRequest = {
        to: addressInput,
        value: BigNumber.from(amountInput),
        from: await wallet.getAddress(),
        data: '0x',
      };

      // Execute simulations and go to simulations page
      const simulationChecks = await transactionController.simulateTransaction(txReq, wallet);

      // TODO: populate simulation results page with the simulations checks
      return { simulationChecks, txReq };
    }
  }

  if (!isAddressValid) {
    addressElem.style.borderColor = 'red';
    return null;
  }

  if (!isAmountValid) {
    amountElem.style.borderColor = 'red';
    return null;
  }

  return null;
}

function CreateTransaction() {
  const navigate: NavigateFunction = useNavigate();
  const onTestTransaction = async () => {
    const addressElem = (document.getElementById('to-address-input') as HTMLInputElement);
    const amountElem = (document.getElementById('amount-input') as HTMLInputElement);
    const validatedTransaction = await TestTransaction(addressElem, amountElem);
    if (validatedTransaction) {
      console.log('ran 1');
      console.log('simulations', validatedTransaction.simulationChecks);
      console.log('txreq', validatedTransaction.txReq);
      navigate('/SimulationResults', { state: { simulationChecks: validatedTransaction.simulationChecks, txReq: validatedTransaction.txReq } });
    } else {
      throw new Error('Failed to get simulations.');
    }
  };

  return (
    <div className="container">
      <div className="user">
        <img src="../../avatar.png" alt="avatar" className="avatar" />
        {/* TODO: Change from address to match the wallet's address */}
        <div className="address">0x510928a823b...</div>
        <FontAwesomeIcon className="copy fa-icon" icon={faCopy} />
      </div>

      <div className="header">
        <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="4x" />
        <h1>Send Transaction</h1>
      </div>

      <div className="field-entry">
        <div className="field no-unit-field">
          <h4 id="from-address-label">From:</h4>
          <p>0x510928a823b892093ac83094ef</p>
        </div>
        <div className="field no-unit-field">
          <h4 id="to-address-label">To:</h4>
          <input id="to-address-input" type="text" name="to" />
          {/* <select id="to-address-input" name="to-address">
            <option>Timmy Turner (0x98173ae89374dc83a89909234a)</option>
          </select> */}
        </div>
        <div className="field">
          <h4 id="amount-label">Amount:</h4>
          <div className="currency-conversion">
            <input id="amount-input" type="text" name="amount" />
            <h5 id="amount-in-usd">USD</h5>
          </div>
          <h4 id="eth" className="unit">ETH</h4>
        </div>
        {/* <div className="field">
            <h4 id="gas-label">Gas Fee:</h4>
            <div className="currency-conversion">
              <input id="gas-input" type="text" name="gas" />
              <h5>USD</h5>
            </div>
            <h4 className="unit">Gwei</h4>
            <FontAwesomeIcon className="fa-icon" icon={faQuestionCircle} />
          </div> */}
        <div className="field">
          <h4 id="data-label">Data:</h4>
          <div className="data-class">
            <input id="data-input" type="text" name="data" />
          </div>
        </div>
      </div>

      <div className="button-container">
        <Link id="back-link" className="back-icon link hoverable" to="/Home">
          <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
        </Link>
        <span>
          {/* <Link to="/SimulationResults"> */}
          <button id="test" className="bottom-button" type="button" onClick={() => onTestTransaction()}>Test Transaction</button>
          {/* </Link> */}
          <FontAwesomeIcon id="help-test" className="fa-icon" icon={faQuestionCircle} />
        </span>
      </div>
    </div>
  );
}

export default CreateTransaction;
