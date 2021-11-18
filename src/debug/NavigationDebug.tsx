import { Link } from 'react-router-dom';

import './NavigationDebug.scss';

function NavigationDebug() {
  return (
    <div id="navigation-debug">
      <div className="wallet-setup-nav-debug">
        <Link className="link" to="/CreateNewWallet">
          <button type="button">Create New Wallet</button>
        </Link>
        <Link className="link" to="/CreatePassword">
          <button type="button">Create Password</button>
        </Link>
        <Link className="link" to="/ImportPrivateKey">
          <button type="button">Import Private Key</button>
        </Link>
        <Link className="link" to="/ImportSecretPhrase">
          <button type="button">Import Secret Phrase</button>
        </Link>
        <Link className="link" to="/WalletSetup">
          <button type="button">Wallet Setup</button>
        </Link>
        <Link className="link" to="/ExistingWallet">
          <button type="button">Existing Wallet</button>
        </Link>
      </div>

      <div className="main-nav-debug">
        <Link className="link" to="/Home">
          <button type="button">Home</button>
        </Link>
        <Link className="link" to="/ProfileSettings">
          <button type="button">Profile Settings</button>
        </Link>
        <Link className="link" to="/SignIn">
          <button type="button">Sign In</button>
        </Link>
      </div>

      <div className="transaction-nav-debug">
        <Link className="link" to="/CreateTransaction">
          <button type="button">Create Transaction</button>
        </Link>
        <Link className="link" to="/ReplaceTransaction">
          <button type="button">Replace Transaction</button>
        </Link>
        <Link className="link" to="/SimulationResults">
          <button type="button">Simulation Results</button>
        </Link>
      </div>
    </div>
  );
}

export default NavigationDebug;
