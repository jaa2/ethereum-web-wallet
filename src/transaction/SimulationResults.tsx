import { Link, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faFire, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import './SimulationResults.scss';

function SimulationResults() {
  const { simulationChecks } = useLocation().state;
  const { txReq } = useLocation().state;
  console.log(simulationChecks);
  console.log(txReq);
  return (
    <div id="simulation-results">
      <div className="card border-info mb-3">
        <div className="card-body">
          <h4 className="card-title">Transaction Details</h4>
          <p className="card-text">
            <div id="top-box">
              <p>0x51092...094ef to James Augsten (0x98173...)</p>
              <p><b>Contract interaction: Transfer 1 ETH to James Augsten</b></p>
              <div id="transaction-details">
                <div id="gas-fee">
                  <FontAwesomeIcon className="fa-icon" icon={faGasPump} size="2x" />
                  <p>
                    At Most
                    <h3> 130 Gwei </h3>
                  </p>
                </div>
                <div id="amount">
                  <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="2x" />
                  <p>
                    Sent to &quot;James Augsten&quot;
                    <h3> 1 ETH </h3>
                  </p>
                </div>
                <div id="max-tx-fee">
                  <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" />
                  <p>
                    Gas limit: 46,142
                    Max tx fee
                    <h3> .00035 ETH </h3>
                  </p>
                </div>
              </div>
            </div>
          </p>
        </div>
      </div>

      <div id="simulation-text"><h1>Simulation Successful!</h1></div>

      <div id="checklist">
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          Known Token
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          Gas: 40,190 (87.1% of limit)
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          Tx fee: 0.003580 ETH
        </div>
      </div>
      <div id="checklist">
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          Sufficient ETH for gas fee
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          Token sent to non-contract address
        </div>
        <div id="item">
          <FontAwesomeIcon icon={faCheckCircle} />
          Reasonable gas price
        </div>
      </div>
      <h1> </h1>
      <h3>Token Transfers</h3>
      <p>
        0x51092...094ef to
        {' '}
        <b>James Augsten</b>
        {' '}
        for 1 ETH
        {' '}
      </p>

      <div id="bottom-buttons">
        <Link to="/Home">
          <button type="button" className="btn btn-primary">Reject Transaction</button>
        </Link>

        <Link to="/CreateTransaction">
          <button type="button" className="btn btn-info">Edit Transaction</button>
        </Link>

        <Link to="/Home">
          <button type="button" className="btn btn-success">Send Transaction</button>
        </Link>
      </div>
    </div>
  );
}

export default SimulationResults;
