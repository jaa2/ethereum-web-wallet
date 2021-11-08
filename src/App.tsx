import React from 'react';
import './App.css';
import { utils, BigNumber, Wallet } from 'ethers';
import browser from "webextension-polyfill";
import { BackgroundWindowInterface } from '../background/background';
import { WalletState } from '../background/WalletState';

declare global {
    interface Window extends BackgroundWindowInterface {
    }
}

interface WalletAddressBox {
  state: {
    walletAddress?: string|null;
    decryptionProgress?: Number|null;
    creatingWallet?: boolean;
    savingWallet?: boolean;
  }
}

class WalletAddressBox extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      walletAddress: null,
      savingWallet: false,
      decryptionProgress: null
    };
    this.load();
  }

  async load() {
    var backgroundWindow = await browser.runtime.getBackgroundPage();
    var _this = this;

    var walletState: WalletState = backgroundWindow.stateObj.walletState;
    var wallet = await walletState.getWallet();
    var hasWalletPromise: Promise<void>;
    /**
     * There are several cases handled here:
     * - Decrypted wallet loaded into memory
     * - Encrypted wallet not loaded into memory, and
     *   - Encrypted wallet saved in local storage
     *   - No wallet saved in local storage
     */
    if (wallet === null) {
      // Encrypted wallet not loaded into memory
      hasWalletPromise = walletState.loadEncrypted()
      .then(() => {
        // Encrypted wallet saved in local storage
        return walletState.decryptWallet("password", function (progress: Number) {
          _this.setState({
            decryptionProgress: progress
          });
        });
      })
      .catch(async (reason) => {
        // No wallet saved in local storage
        console.log(reason, "Creating wallet...");
        await backgroundWindow.stateObj.walletState.createWallet(false);
        _this.setState({
          savingWallet: true
        });
        // Save the wallet to local storage
        await backgroundWindow.stateObj.walletState.saveEncryptedWallet(false, "password");
        _this.setState({
          savingWallet: false
        });
      });
    } else {
      // Decrypted wallet loaded into memory
      hasWalletPromise = Promise.resolve();
    }

    hasWalletPromise.then(async () => {
      // Display address on screen
      var walletAddress: string = (await backgroundWindow.stateObj.walletState.getWallet() as Wallet).address;
      _this.setState({
        walletAddress: walletAddress
      });
    });
  }

  render() {
    if (this.state.savingWallet) {
      return <p>Encrypting your new wallet (this could take a while)...</p>
    }
    if (this.state.walletAddress === null && this.state.decryptionProgress !== null) {
      return(
        <div>
          <p>Decrypting...</p>
          <progress max="100" value={Number(this.state.decryptionProgress) * 100}></progress>
        </div>
      )
    }
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
