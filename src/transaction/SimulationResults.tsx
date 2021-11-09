import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faFire} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import './SimulationResults.scss';

function SimulationResults() {
  return (
    <div id="simulation-results">
      <h1>Transaction Details</h1>
        <div id="transaction-details">
          <div id = "gas-fee">
            <FontAwesomeIcon className="fa-icon" icon={faGasPump} size="2x" />
            <h4>At Most</h4> <h2> 130 Gwei </h2>
          </div>
          <div id = "amount">
            <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="2x" />
            <h4>ETH sent to "Timmy Turner"</h4> <h2> 1 ETH </h2>
          </div>
          <div id = "max-tx-fee">
          <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" />
          <h4>Max tx fee   Gas limit: 46,142</h4> <h2> 0.00035201 ETH </h2>
          </div>
      </div>
    </div>
  );
}
  
export default SimulationResults;