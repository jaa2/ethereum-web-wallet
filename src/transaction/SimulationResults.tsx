import { Link } from 'react-router-dom';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheckCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import Modal from 'react-bootstrap/Modal';
import { TransactionRequest } from '@ethersproject/abstract-provider';

import './SimulationResults.scss';
import { ethers, Wallet } from 'ethers';
import { TokenTransferBox } from './TokenTransferBox';
import UserState from '../common/UserState';
import WalletState from '../../background/WalletState';

const GasOptions = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <FontAwesomeIcon className="fa-icon" icon={faEdit} onClick={showModal} cursor="pointer" />
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <div id="max-tx-fee">
            <h3>
              <FontAwesomeIcon className="fa-icon" icon={faFire} size="2x" color="#489aca" />
              {' '}
              Adjust Gas
            </h3>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <div className="form-group">
              <label className="form-label mt-4" htmlFor="gas-limit"> Gas Limit</label>
              <div className="input-group mb-3">
                <input type="text" className="form-control" />
              </div>
              <label className="form-label mt-4" htmlFor="gas-limit"> Max fee per gas</label>
              <div className="input-group mb-3">
                <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                <span className="input-group-text">Gwei</span>
              </div>
              <label className="form-label mt-4" htmlFor="gas-limit"> Max priority fee per gas</label>
              <div className="input-group mb-3">
                <input type="text" className="form-control" aria-label="Amount (to the nearest dollar)" />
                <span className="input-group-text">Gwei</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={hideModal}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={hideModal}>Save</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

function SimulationResults() {
  const tx: TransactionRequest = {
    from: '0xd67e28a63cfa5381d3d346d905e2f1a6471bde11',
    to: '0xe592427a0aece92de3edee1f18e0157c05861564',
    data: '0x414bf389000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000d67e28a63cfa5381d3d346d905e2f1a6471bde11000000000000000000000000000000000000000000000000000000016191490900000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000002fa215d28153b0000000000000000000000000000000000000000000000000000000000000000',
    value: '0x38d7ea4c68000',
  };

  async function sendSomething() {
    const pendingTxStore = await UserState.getPendingTxStore();
    const wallet: WalletState = await UserState.getWalletState();
    const realWallet: Wallet | null = await wallet.getWallet();
    if (realWallet === null) {
      return;
    }
    const newTx: TransactionRequest = {
      to: realWallet.address,
      value: ethers.utils.parseEther('0.00001'),
    };
    const provider = await UserState.getProvider();
    if (provider === null) {
      return;
    }
    const response = await realWallet.connect(provider).sendTransaction(newTx);
    await pendingTxStore.addPendingTransaction(response, true);
  }

  return (
    <div id="simulation-results">
      <div className="card border-info mb-3">
        <div className="card-body">
          <h3 className="card-title">Transaction Details</h3>
          <p className="card-text">
            <div id="top-box">
              <p>0x51092...094ef to James Augsten (0x98173...)</p>
              <p><b>Contract interaction: Transfer 1 ETH to James Augsten</b></p>
              <div id="transaction-details">
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
                  <GasOptions />
                </div>
              </div>
            </div>
          </p>
        </div>
      </div>

      <div id="simulation-text"><h1>Simulation Successful!</h1></div>

      <table className="table table-hover">
        <tbody>
          <tr className="table-secondary">
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Known Token
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Gas: 40,190 (87.1% of limit)
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Tx fee: 0.003580 ETH
            </td>
          </tr>
          <tr className="table-secondary">
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Sufficient ETH for gas fee
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Token sent to non-contract address
            </td>
            <td align="left">
              <FontAwesomeIcon icon={faCheckCircle} />
              {' '}
              Reasonable gas price
            </td>
          </tr>
        </tbody>
      </table>

      <h1>Token Transfers</h1>
      <TokenTransferBox tx={tx} />
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
          <button type="button" className="btn btn-primary">Edit Transaction</button>
        </Link>

        <Link to="/Home">
          <button type="button" className="btn btn-success" onClick={sendSomething}>Send Transaction</button>
        </Link>
      </div>
    </div>
  );
}

export default SimulationResults;
