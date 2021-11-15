import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faCloudUploadAlt, faKey, faPlus } from '@fortawesome/free-solid-svg-icons';

import './WalletSetup.scss';

function CreateNewWallet() {
  console.log('TODO: Creating new wallet!'); // eslint-disable-line
}

function ImportSecretPhrase() {
  console.log('TODO: Importing from secret recovery page!'); // eslint-disable-line
}

function ImportPrivateKey() {
  console.log('TODO: Importing from private key!'); // eslint-disable-line
}

function WalletSetup() {
  return (
    <div id="wallet-setup">
      <div id="wallet-setup-header">
        <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="3x" />
        <h1>Ethereum Web Wallet</h1>
      </div>

      <h2>Wallet Setup</h2>

      <Link id="wallet-setup-create-wallet" to="/CreateNewWallet" onClick={CreateNewWallet}>
        <button type="button" id="wallet-setup-create-wallet-button" className="btn btn-outline-secondary">
          <FontAwesomeIcon className="fa-icon" icon={faPlus} size="3x" />
          <p className="text-primary">Create New Wallet</p>
        </button>
      </Link>

      <div id="wallet-setup-other-options">
        <Link id="wallet-setup-import-phrase" to="/ImportSecretPhrase" onClick={ImportSecretPhrase}>
          <button type="button" id="wallet-setup-import-phrase-button" className="btn btn-outline-secondary">
            <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="2x" />
            <p className="text-primary">Import Secret Recovery Phrase</p>
          </button>
        </Link>

        <Link id="wallet-setup-import-key" to="/ImportPrivateKey" onClick={ImportPrivateKey}>
          <button type="button" id="wallet-setup-import-key-button" className="btn btn-outline-secondary">
            <FontAwesomeIcon className="fa-icon" icon={faKey} size="2x" />
            <p className="text-primary">Import Wallet by Private Key</p>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default WalletSetup;
