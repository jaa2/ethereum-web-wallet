import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import WalletSetup from './wallet_setup/WalletSetup';
import CreatePassword from './wallet_setup/CreatePassword';
import './styles.scss';

function App() {
  return (
    <div className="App">
      <Link to="/WalletSetup">
        <button>Wallet Setup</button>
      </Link>
      <Link to="/CreatePassword">
        <button>Create Password</button>
      </Link>
      
      <Routes>
        <Route path="/WalletSetup" element={<WalletSetup />} />
        <Route path="/CreatePassword" element={<CreatePassword />} />
      </Routes>
    </div>
  );
}

export default App;
