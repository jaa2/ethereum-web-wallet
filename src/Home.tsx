import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faLock, faPaperPlane, faExchangeAlt,
} from '@fortawesome/free-solid-svg-icons';

import './Home.scss';

import AddressBox from './common/AddressBox';

function Home() {
  const address: string = '0x510928a823b892093ac83904ef';

  return (
    <div id="home">
      <div className="top-bar mb-4">
        <div className="user">
          <img src="/avatar.png" alt="avatar" className="avatar" />
          <div id="home-user-options">
            <div className="option">
              <AddressBox address={address} />
            </div>
            <Link className="option" to="/ProfileSettings">
              <FontAwesomeIcon className="fa-icon" icon={faCog} size="1x" fixedWidth />
              <p className="icon-label">Profile Settings</p>
            </Link>
            <Link className="option" to="/SignIn">
              <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" fixedWidth />
              <p className="icon-label">Lock Account</p>
            </Link>
          </div>
        </div>
        <div className="field no-unit-field">
          <select id="network-input" name="network">
            <option>Main Ethereum Network</option>
          </select>
        </div>
      </div>

      <div id="total" className="m-2">
        <h1>2.4529 ETH</h1>
        <h2>7,632.05 USD</h2>
      </div>

      <div id="assets" className="m-2">
        <label className="form-label" htmlFor="assets-table">Assets</label>
        <table id="assets-table" className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">USD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1000 Tether (USDT)</th>
              <td>$1000</td>
            </tr>
          </tbody>
        </table>
        <FontAwesomeIcon className="fa-icon" icon={faExchangeAlt} size="3x" />
        <p>Swap</p>
      </div>

      <div id="activity" className="m-2">
        <label className="form-label" htmlFor="activity-table">Recent Activity</label>
        <table id="activity-table" className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Action</th>
              <th scope="col">Gas Price</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">16 minutes ago</th>
              <td>Transfer 100 USDT to...</td>
              <td>108.5 Gwei</td>
              <td>Etherscan Link (WIP)</td>
            </tr>
          </tbody>
        </table>
        <Link to="/CreateTransaction">
          <FontAwesomeIcon className="fa-icon" icon={faPaperPlane} size="3x" />
          <p>Send</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
