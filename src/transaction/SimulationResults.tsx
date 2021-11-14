import { Link, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faFire } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import './SimulationResults.scss';

function SimulationResults() {
  console.log('ran 2');
  const { simulationChecks } = useLocation().state;
  console.log(simulationChecks);
  return (
    <div id="simulation-results">

      <div id="top-box">
        <h1>Transaction Details</h1>
        <h3>0x51092...094ef to Timmy Turner (0x98173...)</h3>
        <h3><b>Contract interaction: Transfer 1 ETH to Timmy Turner</b></h3>
        <div id="transaction-details">
          <div id="gas-fee">
            <FontAwesomeIcon className="fa-icon" icon={faGasPump} size="2x" />
            <h5>
              At Most
              <h3> 130 Gwei </h3>
            </h5>
          </div>
          <div id="amount">
            <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="2x" />
            <h5>
              ETH sent to &quot;Timmy Turner&quot;
              <h3> 1 ETH </h3>
            </h5>
          </div>
          <div id="max-tx-fee">
            <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" />
            <h5>
              Max tx fee   Gas limit: 46,142
              <h3> 0.00035201 ETH </h3>
            </h5>
          </div>
        </div>
      </div>

      <div id="simulation-text"><h1><b>Simulation Successful!</b></h1></div>

      <div id="checklist">
        {/* <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          <h4> Known Token</h4>
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          <h4> Simulation gas: 40,190 (87.1% of limit)</h4>
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          <h4> Simulation tx fee: 0.003580 ETH</h4>
        </div>
      </div>
      <div id="checklist">
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          <h4> Sufficient ETH for gas fee</h4>
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          <h4> Token sent to non-contract address</h4>
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          <h4> Reasonable gas price</h4>
        </div> */}
      </div>

      <h1>Token Transfers</h1>
      <h4>
        0x51092...094ef to
        <b>Timmy Turner</b>
        {' '}
        for 1 ETH
        {' '}
      </h4>

      <div id="bottom-buttons">
        <Link to="/Home">
          <button className="button reject-transaction" type="button">Reject Transaction</button>
        </Link>

        <Link to="/CreateTransaction">
          <button className="button edit-transaction" type="button">Edit Transaction</button>
        </Link>

        <Link to="/Home">
          <button className="button send-transaction" type="button">Send Transaction</button>
        </Link>
      </div>
    </div>
  );
}

export default SimulationResults;
