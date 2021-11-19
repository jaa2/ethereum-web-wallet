import React, { useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faArrowCircleLeft, faCog,
} from '@fortawesome/free-solid-svg-icons';

import UserState from '../common/UserState';
import AddressBox from '../common/AddressBox';

import './CreateTransaction.scss';
import HelpModal, { IHelpModalProps } from '../common/HelpModal';

interface TransactionAction {
  action: String
}

function CreateTransaction(props: TransactionAction) {
  const { action } = props;

  const [address, setAddress]:
  [string, (matchState: string) => void] = React.useState<string>('0x510928a823b892093ac83904ef');

  const navigate: NavigateFunction = useNavigate();

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
          <label className="col-form-label mt-4" htmlFor="toAddress">To:</label>
          <input type="text" className="form-control" placeholder="" id="toAddress" />
        </div>
        <div className="form-group">
          <label htmlFor="amount" className="form-label mt-4">Amount</label>
          <div className="form-group">
            <div className="input-group mb-3">
              <input type="text" className="form-control" id="amount" aria-label="Amount" />
              <span className="input-group-text">ETH</span>
            </div>
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
            <Link className="back-icon" to="/SimulationResults">
              <button type="button" className="btn btn-info">Test Transaction</button>
            </Link>
            {/* <FontAwesomeIcon id="help-test" className="fa-icon" icon={faQuestionCircle} /> */}
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
            <Link className="back-icon" to="/SimulationResults">
              <button type="button" className="btn btn-info">Test Transaction</button>
            </Link>
            {/* <FontAwesomeIcon id="help-test" className="fa-icon" icon={faQuestionCircle} /> */}
            <HelpModal
              title={simulationModalProps.title}
              description={simulationModalProps.description}
            />
          </span>
        </div>
        )}
    </div>
  );
}

export default CreateTransaction;
