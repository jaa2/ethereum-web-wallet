import {
  Routes, Route, Link, useLocation,
} from 'react-router-dom';
import NavigationDebug from './debug/NavigationDebug';

import CreateNewWallet from './wallet_setup/CreateNewWallet';
import CreatePassword from './wallet_setup/CreatePassword';
import ImportPrivateKey from './wallet_setup/ImportPrivateKey';
import ImportSecretPhrase from './wallet_setup/ImportSecretPhrase';
import WalletSetup from './wallet_setup/WalletSetup';

import Home from './Home';
import ProfileSettings from './ProfileSettings';
import Unlock from './Unlock';

import CreateTransaction from './transaction/CreateTransaction';
import SimulationResults from './transaction/SimulationResults';

import './App.scss';
import ExistingWallet from './ExistingWallet';

function App() {
  return (
    <div id="App">
      <link id="dark-theme-style" rel="stylesheet" />
      <div id="debug-bar">
        <Link className="debug-control" to="/NavigationDebug">
          <button type="button">Navigation Debug</button>
        </Link>

        <Link className="debug-control" to={useLocation().pathname} target="_blank">
          <button type="button">Open in New Window</button>
        </Link>
      </div>

      <Routes>
        <Route path="/NavigationDebug" element={<NavigationDebug />} />

        <Route path="/ExistingWallet" element={<ExistingWallet />} />

        <Route path="/CreateNewWallet" element={<CreateNewWallet />} />
        <Route path="/CreatePassword" element={<CreatePassword />} />
        <Route path="/ImportPrivateKey" element={<ImportPrivateKey />} />
        <Route path="/ImportSecretPhrase" element={<ImportSecretPhrase />} />
        <Route path="/WalletSetup" element={<WalletSetup />} />

        <Route path="/Home" element={<Home />} />
        <Route path="/ProfileSettings" element={<ProfileSettings />} />
        <Route path="/Unlock" element={<Unlock />} />

        <Route path="/CreateTransaction" element={<CreateTransaction action="Send" />} />
        <Route path="/ReplaceTransaction" element={<CreateTransaction action="Replace" />} />
        <Route path="/SimulationResults" element={<SimulationResults />} />
      </Routes>
    </div>
  );
}

export default App;
