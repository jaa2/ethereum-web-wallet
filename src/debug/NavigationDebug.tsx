import { Link } from 'react-router-dom';

import './NavigationDebug.scss'

function NavigationDebug() {
    return (
      <div className="navigation-debug">
        <div className="wallet-setup-nav-debug">
          <Link className="link" to="/CreateNewWallet">
            <button>Create New Wallet</button>
          </Link>
          <Link className="link" to="/CreatePassword">
            <button>Create Password</button>
          </Link>
          <Link className="link" to="/ImportPrivateKey">
            <button>Import Private Key</button>
          </Link>
          <Link className="link" to="/ImportSecretPhrase">
            <button>Import Secret Phrase</button>
          </Link>
          <Link className="link" to="/WalletSetup">
            <button>Wallet Setup</button>
          </Link>
        </div>

        <div className="main-nav-debug">
          <Link className="link" to="/Home">
            <button>Home</button>
          </Link>
          <Link className="link" to="/ProfileSettings">
            <button>Profile Settings</button>
          </Link>
          <Link className="link" to="/SignIn">
            <button>Sign In</button>
          </Link>
        </div>

        <div className="transaction-nav-debug">
          <Link className="link" to="/CreateTransaction">
            <button>Create Transaction</button>
          </Link>
          <Link className="link" to="/ReplaceTransaction">
            <button>Replace Transaction</button>
          </Link>
          <Link className="link" to="/SimulationResults">
            <button>Simulation Results</button>
          </Link>
        </div>
      </div>
    );
  }
  
export default NavigationDebug;
  