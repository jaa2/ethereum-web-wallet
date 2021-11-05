import React from 'react';
import './App.css';
import { utils, BigNumber } from 'ethers';
import browser from "webextension-polyfill";

declare global {
  interface Window {
      stateObj?: any;
      generateWallet: () => Promise<void>;
  }
}

interface WalletAddressBox {
  state: {
    walletAddress?: string|null;
  }
}

class WalletAddressBox extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      walletAddress: null,
    };
    this.load();
  }

  async load() {
    var backgroundWindow = await browser.runtime.getBackgroundPage();
    if (backgroundWindow.stateObj.wallet == null) {
      await backgroundWindow.generateWallet();
    }
    this.setState({
      walletAddress: backgroundWindow.stateObj.wallet.address
    });
  }

  render() {
    return (
        <a className="walletAddressBox"
        href={"https://ropsten.etherscan.io/address/" + this.state.walletAddress}>
          {this.state.walletAddress}
        </a>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <WalletAddressBox />
      <p>{utils.formatEther(BigNumber.from("0xfffffffff"))}</p>
      </header>
    </div>
  );
}

export default App;
