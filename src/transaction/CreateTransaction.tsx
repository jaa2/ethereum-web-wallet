/* eslint-disable no-param-reassign */
import {
  Link, NavigateFunction, useLocation, useNavigate,
} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faPaperPlane, faQuestionCircle, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';

import './CreateTransaction.scss';
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber, ethers, Wallet } from 'ethers';
import { BackgroundWindowInterface } from 'background/background';
import browser from 'webextension-polyfill';
import SimulationSendTransactions from '../SimulationSendTransactions';
import SimulationSuite from '../SimulationSuite';

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

  const txReq : TransactionRequest = {
    to: addressInput,
  };

  const amountRegex = /^([1-9]\d*|0)((\.\d{1,8})?)$/;

  const isAddressValid = await SimulationSuite.isAddressValid(txReq);
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
      // finish creating create transaction request object
      txReq.value = ethers.utils.parseEther(amountInput);
      txReq.from = await wallet.getAddress();
      txReq.data = '0x';
      txReq.gasLimit = await transactionController.getGasLimit(txReq);

      // Execute simulations and go to simulations page
      const checksAndTx = await transactionController.simulateTransaction(txReq, wallet);
      const contractOrEOA = await provider.getCode(addressInput);

      return {
        simulationChecks: checksAndTx.simulationChecks,
        txReq: checksAndTx.t,
        contractOrEOA,
      };
    }
  }

  if (!isAddressValid) {
    addressElem.style.border = '5px solid #ff0000';
  }

  if (!isAmountValid) {
    amountElem.style.border = '5px solid #ff0000';
  }

  return null;
}

function CreateTransaction() {
  const navigate: NavigateFunction = useNavigate();
  const onTestTransaction = async () => {
    const addressElem = (document.getElementById('toAddress') as HTMLInputElement);
    const amountElem = (document.getElementById('amount') as HTMLInputElement);
    const validatedTransaction = await TestTransaction(addressElem, amountElem);

    if (validatedTransaction) {
      navigate('/SimulationResults', {
        state: {
          simulationChecks: validatedTransaction.simulationChecks,
          txReq: validatedTransaction.txReq,
          contractOrEOA: validatedTransaction.contractOrEOA,
        // eslint-disable-next-line @typescript-eslint/comma-dangle
        }
      });
    }
  };

  const location = useLocation();
  let dest = '';
  let tAmount = '';
  if (location.state !== null) {
    dest = location.state.txReq.to;
    tAmount = ethers.utils.formatEther(BigNumber.from(location.state.txReq.value).toString());
  }

  return (
    <div className="container">
      <div className="user">
        <img src="../../avatar.png" alt="avatar" className="avatar" />
        {/* TODO: Change from address to match the wallet's address */}
        <div className="address">0x510928a823b...</div>
        <FontAwesomeIcon className="copy fa-icon" icon={faCopy} />
      </div>

      <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="4x" />
      <h1>Send Transaction</h1>

      <div className="field-entry">
        <div className="form-group">
          <fieldset disabled className="disabled-field">
            <label className="form-label" htmlFor="fromAdress">From:</label>
            <input className="form-control" id="fromAdress" type="text" placeholder="0x510928a823b892093ac83094ef" disabled />
          </fieldset>
        </div>
        <div className="form-group">
          <label className="col-form-label mt-4" htmlFor="toAddress">To:</label>
          <input type="text" className="form-control" placeholder={dest} id="toAddress" />
        </div>
        <div className="form-group">
          <label htmlFor="amount" className="form-label mt-4">Amount</label>
          <div className="form-group">
            <div className="input-group mb-3">
              <input type="text" className="form-control" id="amount" placeholder={tAmount} aria-label="Amount" />
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
      <div className="button-container">
        <Link className="back-icon" to="/Home">
          <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
        </Link>
        <span>
          {/* <Link to="/SimulationResults"> */}
          {/* // <Link className="back-icon" to="/SimulationResults">
          //   <button type="button" className="btn btn-info">Test Transaction</button>
          // </Link> */}
          <button id="test" className="btn btn-info" type="button" onClick={() => onTestTransaction()}>Test Transaction</button>
          {/* </Link> */}
          <FontAwesomeIcon id="help-test" className="fa-icon" icon={faQuestionCircle} />
        </span>
      </div>
    </div>
  );
}

export default CreateTransaction;
