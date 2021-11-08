import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faCloudUploadAlt, faKey, faPlus } from '@fortawesome/free-solid-svg-icons';

import './WalletSetup.scss'

function WalletSetup() {
  return (
    <div id="wallet-setup">
      <div id="wallet-setup-header">
        <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="3x" />
        <h1>Ethereum Web Wallet</h1>
      </div>

      <h1>Wallet Setup</h1>

      <Link id="wallet-setup-create-wallet" className="link hoverable" to="/CreateNewWallet" onClick={CreateNewWallet} >
        <FontAwesomeIcon className="fa-icon" icon={faPlus} size="3x" />
        <h2>Create New Wallet</h2>
      </Link>

      <div id="wallet-setup-other-options">
        <Link id="wallet-setup-import-phrase" className="link hoverable" to="/ImportSecretPhrase" onClick={ImportSecretPhrase} >
          <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="2x" />
          <h4>Import Secret Recovery Phrase</h4>
        </Link>

        <Link id="wallet-setup-import-key" className="link hoverable" to="/ImportPrivateKey" onClick={ImportPrivateKey} >
          <FontAwesomeIcon className="fa-icon" icon={faKey} size="2x" />
          <h4>Import Wallet by Private Key</h4>
        </Link>
      </div>
    </div>
  );
}

function CreateNewWallet() {
  console.log("Creating new wallet!");
}

function ImportSecretPhrase() {
  console.log("Importing from secret recovery page!");
}

function ImportPrivateKey() {
  console.log("Importing from private key!");
}

export default WalletSetup;