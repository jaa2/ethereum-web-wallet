import { EtherscanProvider, Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import browser from 'webextension-polyfill';
import PendingTransactionStore from './PendingTransactionStore';
import WalletState from './WalletState';
import { WalletStorage } from './WalletStorage';

export interface BackgroundWindowInterface {
  stateObj: {
    walletState: WalletState,
    provider: Provider | null,
    pendingTransactionStore: PendingTransactionStore
  };

  connectWallet: () => Promise<void>;
}

declare global {
  interface Window extends BackgroundWindowInterface {
  }
}

window.stateObj = {
  walletState: new WalletState((browser.storage.local as WalletStorage)),
  provider: null,
  pendingTransactionStore: new PendingTransactionStore((browser.storage.local as WalletStorage)),
};

window.stateObj.walletState.loadEncrypted()
  .catch((reason: string) => {
    const myConsole: Console = console;
    myConsole.warn(`[Background] Could not load encrypted: ${reason}`);
  });
window.stateObj.provider = new EtherscanProvider('ropsten', 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');

window.connectWallet = async () => {
  window.stateObj.walletState.currentWallet = (await
  window.stateObj.walletState.getWallet() as Wallet).connect(window.stateObj.provider as Provider);
};
