import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPaperPlane, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';

import "./CreateTransaction.scss";

function ReplaceTransaction() {
  return (
    <div className="container">
      <div className="user">
        <img src="../../avatar.png" alt="avatar" className="avatar" />
        <div className="address">0x510928a823b...</div>
        <FontAwesomeIcon className="copy fa-icon" icon={faCopy}></FontAwesomeIcon>
      </div>

      <div className="header">
        <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="4x" />
        <h1>Replace Transaction</h1>
      </div>

      <div className="field-entry">
          <div className="field no-unit-field">
            <h4 id="from-address-label" >From:</h4>
            <p>0x510928a823b892093ac83094ef</p>
          </div>
          <div className="field no-unit-field">
            <h4 id="to-address-label" >To:</h4>
            <p>Timmy Turner (0x98173ae89374dc83a89909234a)</p>
          </div>
          <div className="field">
            <h4 id="amount-label">Amount:</h4>
            <div className="currency-conversion">
              <input id="amount-input" type="text" name="amount" />
              <h5>USD</h5>
            </div>
            <h4 id="eth" className="unit">ETH</h4>
          </div>
          <div className="field">
            <h4 id="gas-label">Gas Fee:</h4>
            <div className="currency-conversion">
              <input id="gas-input" type="text" name="gas" />
              <h5>USD</h5>
            </div>
            <h4 className="unit">Gwei</h4>
            <FontAwesomeIcon className="fa-icon" icon={faQuestionCircle} />
          </div>
      </div>

      <div className="button-container">
        <Link to="/Home">
          <button id="discard" className="bottom-button">Discard Changes</button>
        </Link>
        <span>
          <Link to="/SimulationResults">
            <button id="test" className="bottom-button">Test Transaction</button>
          </Link>
          <FontAwesomeIcon className="fa-icon" icon={faQuestionCircle} />
        </span>
      </div>
    </div>
  );
}

export default ReplaceTransaction;