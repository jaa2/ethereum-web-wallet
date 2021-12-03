import {
  Routes, Route, /* Navigate, Link, useLocation, */
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

// TODO: Gate off routes based on if the user has authenticated or not

const App = function App() {
  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<ExistingWallet />} />

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
};

export default App;
