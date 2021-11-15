import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump, faFire, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { TransactionRequest } from '@ethersproject/abstract-provider';

import './SimulationResults.scss';
import { TokenTransferBox } from './TokenTransferBox';

function SimulationResults() {
  const tx: TransactionRequest = {
    from: '0xd67e28a63cfa5381d3d346d905e2f1a6471bde11',
    to: '0xe592427a0aece92de3edee1f18e0157c05861564',
    data: '0x414bf389000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000d67e28a63cfa5381d3d346d905e2f1a6471bde11000000000000000000000000000000000000000000000000000000016191490900000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000002fa215d28153b0000000000000000000000000000000000000000000000000000000000000000',
    value: '0x38d7ea4c68000',
  };
  return (
    <div id="simulation-results">

      <div id="top-box">
        <h1>Transaction Details</h1>
        <h3>0x51092...094ef to (0x98173...)</h3>
        <h3><b>Contract interaction: Transfer 1 ETH</b></h3>
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
              ETH sent
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
        <div id="item">
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
        </div>
      </div>

      <h1>Token Transfers</h1>
      <TokenTransferBox tx={tx} />
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
