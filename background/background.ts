import { EtherscanProvider, Provider } from '@ethersproject/providers';
import browser from 'webextension-polyfill';
import WalletState from './WalletState';
import { WalletStorage } from './WalletStorage';

export interface BackgroundWindowInterface {
  stateObj: {
    walletState: WalletState,
    provider: Provider | null
  };
}

declare global {
  interface Window extends BackgroundWindowInterface {
  }
}

window.stateObj = {
  walletState: new WalletState((browser.storage.local as WalletStorage)),
  provider: null,
};

window.stateObj.walletState.loadEncrypted()
  .catch((reason: string) => {
    const myConsole: Console = console;
    myConsole.warn(`[Background] Could not load encrypted: ${reason}`);
  });
window.stateObj.provider = new EtherscanProvider('ropsten');
