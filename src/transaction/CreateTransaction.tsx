/* eslint-disable no-param-reassign */
import { Link, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faPaperPlane, faQuestionCircle, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';

import './CreateTransaction.scss';
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber, Wallet } from 'ethers';
import SimulationSendTransactions from '../../background/SimulationSendTransactions';

/**
 * Ensures that the inputs of address and amount are valid before sending
 * the transaction
 * @param addressInput The destination address of the transaction
 * @param amountInput The amount being sent
 */
async function ValidateInputs(addressElem: HTMLInputElement, amountElem: HTMLInputElement) {
  addressElem.style.borderColor = 'inherit';
  amountElem.style.borderColor = 'inherit';
  const addressInput = addressElem.value;
  const amountInput = amountElem.value;

  const addressRegex = /0x[0-9a-f]{0,42}/;
  const amountRegex = /([1-9]\d*|0)(\.\d{1,8})?/;
  const isAddressValid = addressRegex.test(addressInput);
  const isAmountValid = amountRegex.test(amountInput);
  if (isAddressValid && isAmountValid) {
    const provider = window.stateObj.provider as Provider;
    const wallet = await window.stateObj.walletState.getWallet() as Wallet;
    // create transaction request object
    // TODO: Also npm run build not working?
    const txReq: TransactionRequest = {
      to: addressInput,
      value: BigNumber.from(amountInput),
      from: await wallet.getAddress(),
    };

    // Execute simulations and go to simulations page
    const simulations: SimulationSendTransactions = new SimulationSendTransactions(provider);
    const simulationChecks = simulations.simulateTransaction(txReq, '0x', wallet);

    // TODO: populate simulation results page with the simulations checks
    console.log(simulationChecks);
    useHistory().push('/SimulationResults');
  }

  if (!isAddressValid) {
    addressElem.style.borderColor = 'red';
  }

  if (!isAmountValid) {
    amountElem.style.borderColor = 'red';
  }
}

function CreateTransaction() {
  return (
    <div className="container">
      <div className="user">
        <img src="../../avatar.png" alt="avatar" className="avatar" />
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
          <select id="to-address-input" name="to-address">
            <option>Timmy Turner (0x98173ae89374dc83a89909234a)</option>
          </select>
        </div>
        <div className="field">
          <h4 id="amount-label">Amount:</h4>
          <div className="currency-conversion">
            <input id="amount-input" type="text" name="amount" />
            <h5>USD</h5>
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
      </div>

      <div className="button-container">
        <Link id="back-link" className="back-icon link hoverable" to="/Home">
          <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
        </Link>
        <span>
          {/* <Link to="/SimulationResults"> */}
          <button id="test" className="bottom-button" type="button" onClick={() => ValidateInputs((document.getElementById('to-address-input') as HTMLInputElement), (document.getElementById('amount-input') as HTMLInputElement))}>Test Transaction</button>
          {/* </Link> */}
          <FontAwesomeIcon id="help-test" className="fa-icon" icon={faQuestionCircle} />
        </span>
      </div>
    </div>
  );
}

export default CreateTransaction;
