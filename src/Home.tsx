import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faCog, faLock, faPaperPlane, faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';

import './Home.scss';

function Home() {
  return (
    <div className="container">
      <div className="top-bar">
        <div className="user">
          <img src="../public/avatar.png" alt="avatar" className="avatar" />
          <div className="user-options">
            <div className="option">
              <div className="address">0x510928a823b...</div>
              <FontAwesomeIcon className="copy fa-icon" icon={faCopy} />
            </div>
            <Link className="option" to="/ProfileSettings">
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="2x" />
              <p className="icon-label">Settings</p>
            </Link>
            <Link className="option" to="/SignIn">
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="2x" />
              <p className="icon-label">Lock</p>
            </Link>
          </div>
        </div>
        <div className="field no-unit-field">
          <select id="network-input" name="network">
            <option>Main Ethereum Network</option>
          </select>
        </div>
      </div>
      <h1>2.4529 ETH</h1>
      <h2>7,632.05 USD</h2>
      <div className="row">
        <div>
          <h3>Assets:</h3>
          <div className="table" />
          <FontAwesomeIcon className="fa-icon" icon={faExchangeAlt} size="3x" />
          <p>Swap</p>
        </div>
        <div>
          <h3>Activity:</h3>
          <div className="table" />
          <Link to="/CreateTransaction">
            <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="3x" />
            <p>Send</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
