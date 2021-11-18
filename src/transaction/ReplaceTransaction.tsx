import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPaperPlane, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import './CreateTransaction.scss';

function ReplaceTransaction() {
  return (
    <div id="replace-transaction" className="transaction-container">
      <div className="user">
        <img src="../../avatar.png" alt="avatar" className="avatar" />
        <div className="address">0x510928a823b...</div>
        <FontAwesomeIcon className="copy fa-icon" icon={faCopy} />
      </div>

      <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="4x" />
      <h1>Replace Transaction</h1>

      <div className="field-entry">
        <div className="form-group">
          <fieldset disabled className="replace-from disabled-field">
            <label className="form-label" htmlFor="fromAdress">From:</label>
            <input className="form-control" id="fromAdress" type="text" placeholder="0x510928a823b892093ac83094ef" disabled />
          </fieldset>
        </div>
        <div className="form-group">
          <fieldset disabled className="disabled-field">
            <label className="form-label" htmlFor="toAddress">To:</label>
            <input className="form-control" id="toAddress" type="text" placeholder="James Austgen (0x98173ae89374dc83a89909234a)" disabled />
          </fieldset>
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
      <div className="button-container">
        <Link to="/Home">
          <button type="button" className="btn btn-primary">Discard Changes</button>
        </Link>
        <span>
          <Link className="back-icon" to="/SimulationResults">
            <button type="button" className="btn btn-info">Test Transaction</button>
          </Link>
          <FontAwesomeIcon id="help-test" className="fa-icon" icon={faQuestionCircle} />
        </span>
      </div>
    </div>
  );
}

export default ReplaceTransaction;
