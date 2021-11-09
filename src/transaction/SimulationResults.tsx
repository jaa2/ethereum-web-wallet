import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faFire} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import './SimulationResults.scss';

function SimulationResults() {
  return (
    <div id="simulation-results">

      <div id="top-box">
        <h1>Transaction Details</h1>
        <h3>0x51092...094ef to Timmy Turner (0x98173...)</h3>
        <h3><b>Contract interaction: Transfer 1 ETH to Timmy Turner</b></h3>
        <div id="transaction-details">
          <div id = "gas-fee">
            <FontAwesomeIcon className="fa-icon" icon={faGasPump} size="2x" />
            <h5>At Most <h3> 130 Gwei </h3></h5> 
          </div>
          <div id = "amount">
            <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="2x" />
            <h5>ETH sent to "Timmy Turner" <h3> 1 ETH </h3></h5> 
          </div>
          <div id = "max-tx-fee">
          <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" />
          <h5>Max tx fee   Gas limit: 46,142 <h3> 0.00035201 ETH </h3></h5> 
          </div>
        </div>
      </div>

      <div id= "bottom-buttons">
        <Link to="/Home"> 
          <button className = "button reject-transaction">Reject Transaction</button>
        </Link>

        <Link to="/CreateTransaction"> 
          <button className = "button edit-transaction">Edit Transaction</button>
        </Link>

        <Link to="/Home"> 
          <button className = "button send-transaction">Send Transaction</button>
        </Link>
      </div>  
    </div>
  );
}
  
export default SimulationResults;