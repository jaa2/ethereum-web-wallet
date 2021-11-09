import React from 'react';
import './App.css';
import { utils, BigNumber, Wallet } from 'ethers';
import browser from 'webextension-polyfill';
import { BackgroundWindowInterface } from '../background/background';

class WalletAddressBox extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      walletAddress: null,
      savingWallet: false,
      decryptionProgress: null,
    };
    this.load();
  }

  state: {
    walletAddress?: string | null;
    decryptionProgress?: Number | null;
    creatingWallet?: boolean;
    savingWallet?: boolean;
  };

  async load() {
    const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();

    const { walletState } = backgroundWindow.stateObj;
    const wallet = await walletState.getWallet();
    let hasWalletPromise: Promise<void>;
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
        .then(
          // Encrypted wallet saved in local storage
          () => walletState.decryptWallet('password', (progress: Number) => {
            this.setState({
              decryptionProgress: progress,
            });
          }),
        )
        .catch(async () => {
          // No wallet saved in local storage
          await backgroundWindow.stateObj.walletState.createWallet(false);
          this.setState({
            savingWallet: true,
          });
          // Save the wallet to local storage
          await backgroundWindow.stateObj.walletState.saveEncryptedWallet(false, 'password');
          this.setState({
            savingWallet: false,
          });
        });
    } else {
      // Decrypted wallet loaded into memory
      hasWalletPromise = Promise.resolve();
    }

    hasWalletPromise.then(async () => {
      // Display address on screen
      const walletAddress: string = (await walletState.getWallet() as Wallet).address;
      this.setState({
        walletAddress,
      });
    });
  }

  render() {
    const { savingWallet, walletAddress, decryptionProgress } = this.state;
    if (savingWallet) {
      return <p>Encrypting your new wallet (this could take a while)...</p>;
    }
    if (walletAddress === null && decryptionProgress !== null) {
      return (
        <div>
          <p>Decrypting...</p>
          <progress max="100" value={Number(decryptionProgress) * 100} />
        </div>
      );
    }
    const walletURL = `https://ropsten.etherscan.io/address/${walletAddress}`;
    return (
      <a
        className="walletAddressBox"
        href={walletURL}
      >
        {walletAddress}
      </a>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href={document.location.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <WalletAddressBox />
        <p>{utils.formatEther(BigNumber.from('0xfffffffff'))}</p>
      </header>
    </div>
  );
}

export default App;
