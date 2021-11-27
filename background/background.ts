import { EtherscanProvider, Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import browser from 'webextension-polyfill';
import InjectedProviderReceiver from './InjectedProviderReceiver';
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
    console.warn(`[Background] Could not load encrypted: ${reason}`); // eslint-disable-line
  });
window.stateObj.provider = new EtherscanProvider('ropsten', 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');

window.connectWallet = async () => {
  window.stateObj.walletState.currentWallet = (await
  window.stateObj.walletState.getWallet() as Wallet).connect(window.stateObj.provider as Provider);
};

// Listen for requests from the injected provider
browser.runtime.onMessage.addListener(InjectedProviderReceiver);
