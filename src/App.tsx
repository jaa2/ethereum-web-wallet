import {
  Routes, Route,
} from 'react-router-dom';
import { useState, useMemo } from 'react';

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

import { WindowType, WindowTypeContext } from './common/OpenNewWindow';

// TODO: Gate off routes based on if the user has authenticated or not

const App = function App() {
  // Global state used for rendering of "Open in New Window" button
  const [windowType, setWindowType]:
  [WindowType, (state: WindowType) => void] = useState<WindowType>(WindowType.FULLSCREEN);

  const contextValue = useMemo(() => ({ windowType, setWindowType }), [windowType]);

  return (
    <div id="App">
      <WindowTypeContext.Provider value={contextValue}>
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
      </WindowTypeContext.Provider>
    </div>
  );
};

export default App;
