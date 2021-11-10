import { Routes, Route, Link } from 'react-router-dom';

import NavigationDebug from './debug/NavigationDebug';

import CreateNewWallet from './wallet_setup/CreateNewWallet';
import CreatePassword from './wallet_setup/CreatePassword';
import ImportPrivateKey from './wallet_setup/ImportPrivateKey';
import ImportSecretPhrase from './wallet_setup/ImportSecretPhrase';
import WalletSetup from './wallet_setup/WalletSetup';

import Home from './Home';
import ProfileSettings from './ProfileSettings';
import SignIn from './SignIn';

import CreateTransaction from './transaction/CreateTransaction';
import ReplaceTransaction from './transaction/ReplaceTransaction';
import SimulationResults from './transaction/SimulationResults';

// TODO: Gate off routes based on if the user has authenticated or not

function App() {
  return (
    <div className="App">
      <Link to="/NavigationDebug">
        <button>Navigation Debug</button>
      </Link>

      <Routes>
        <Route path="/NavigationDebug" element={<NavigationDebug />} />

        <Route path="/CreateNewWallet" element={<CreateNewWallet />} />
        <Route path="/CreatePassword" element={<CreatePassword />} />
        <Route path="/ImportPrivateKey" element={<ImportPrivateKey />} />
        <Route path="/ImportSecretPhrase" element={<ImportSecretPhrase />} />
        <Route path="/WalletSetup" element={<WalletSetup />} />

        <Route path="/Home" element={<Home />} />
        <Route path="/ProfileSettings" element={<ProfileSettings />} />
        <Route path="/SignIn" element={<SignIn />} />

        <Route path="/CreateTransaction" element={<CreateTransaction />} />
        <Route path="/ReplaceTransaction" element={<ReplaceTransaction />} />
        <Route path="/SimulationResults" element={<SimulationResults />} />
      </Routes>
    </div>
  );
}

export default App;
