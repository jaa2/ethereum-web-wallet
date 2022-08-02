import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import {
  faBinoculars, faCloudUploadAlt, faKey, faPlus,
} from '@fortawesome/free-solid-svg-icons';

import './WalletSetup.scss';
import { DelayedClose, getWindowType, WindowType } from '../common/OpenNewWindow';

const WalletSetup = function WalletSetup() {
  const isPopup: boolean = getWindowType() === WindowType.POPUP;
  // Open in new tab if starting from the popup (otherwise, open in the same window as usual)
  const target: string = isPopup ? '_blank' : '_self';
  return (
    <div id="wallet-setup">
      <div id="wallet-setup-header">
        <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="3x" />
        <h1>Ethereum Web Wallet</h1>
      </div>

      <h2>Wallet Setup</h2>

      <Link to="/CreateNewWallet" target={target} rel="noopener noreferrer" onClick={() => isPopup && DelayedClose()}>
        <button type="button" className="btn btn-outline-secondary">
          <FontAwesomeIcon className="fa-icon" icon={faPlus} size="3x" />
          <p className="text-primary">Create New Wallet</p>
        </button>
      </Link>

      <div id="wallet-setup-other-options">
        <Link to="/ImportSecretPhrase" target={target} rel="noopener noreferrer" onClick={() => isPopup && DelayedClose()}>
          <button type="button" className="btn btn-outline-secondary">
            <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="2x" />
            <p className="text-primary">Import Secret Recovery Phrase</p>
          </button>
        </Link>

        <Link to="/ImportPrivateKey" target={target} rel="noopener noreferrer" onClick={() => isPopup && DelayedClose()}>
          <button type="button" className="btn btn-outline-secondary">
            <FontAwesomeIcon className="fa-icon" icon={faKey} size="2x" />
            <p className="text-primary">Import Wallet by Private Key</p>
          </button>
        </Link>
      </div>

      <Link to="/CreateNonSigningWallet" target={target} rel="noopener noreferrer" onClick={() => isPopup && DelayedClose()}>
        <button type="button" className="btn btn-outline-secondary">
          <FontAwesomeIcon className="fa-icon" icon={faBinoculars} size="3x" />
          <p className="text-primary">Create Non-Signing Wallet</p>
        </button>
      </Link>
    </div>
  );
};

export default WalletSetup;
