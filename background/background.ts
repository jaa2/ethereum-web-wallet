import { EtherscanProvider, Provider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import browser from 'webextension-polyfill';
import InjectedProviderReceiver from './InjectedProviderReceiver';
import ProviderNetwork, { getProviderNetworks } from '../src/common/ProviderNetwork';
import InjectedProviderReceiver from './InjectedProviderReceiver';
import PendingTransactionStore from './PendingTransactionStore';
import WalletState from './WalletState';
import { WalletStorage } from './WalletStorage';

export interface BackgroundWindowInterface {
  stateObj: {
    walletState: WalletState,
    provider: Provider | null,
    pendingTransactionStore: PendingTransactionStore,
    selectedNetwork?: ProviderNetwork
  };

  connectWallet: () => Promise<void>;
  changeNetwork: (network: ProviderNetwork) => Promise<void>;
}

declare global {
  interface Window extends BackgroundWindowInterface {
  }
}

window.stateObj = {
  walletState: new WalletState((browser.storage.local as WalletStorage)),
  provider: null,
  pendingTransactionStore: new PendingTransactionStore((browser.storage.local as WalletStorage)),
  selectedNetwork: undefined,
};

window.stateObj.walletState.loadEncrypted()
  .catch((reason: string) => {
    console.warn(`[Background] Could not load encrypted: ${reason}`); // eslint-disable-line
  });
window.stateObj.provider = new EtherscanProvider('ropsten', 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');

// Load pending transactions
window.stateObj.pendingTransactionStore.load(window.stateObj.provider);

window.connectWallet = async () => {
  window.stateObj.walletState.currentWallet = (await
  window.stateObj.walletState.getWallet() as Wallet).connect(window.stateObj.provider as Provider);
};

// Listen for requests from the injected provider
browser.runtime.onMessage.addListener(InjectedProviderReceiver);

async function getSavedNetwork() {
  const record = await browser.storage.local.get('currentNetworkName');
  let selectedNetworkIndex: number = 0;
  if ('currentNetworkName' in record) {
    // Find network by name
    const selectedNetworkName: string = record.currentNetworkName;
    const possibleNetworks = getProviderNetworks();
    for (let i = 0; i < possibleNetworks.length; i += 1) {
      if (possibleNetworks[i].internalName === selectedNetworkName) {
        selectedNetworkIndex = i;
        break;
      }
    }
  }

  window.stateObj.selectedNetwork = getProviderNetworks()[selectedNetworkIndex];
  window.stateObj.provider = new EtherscanProvider(
    window.stateObj.selectedNetwork.internalName,
    'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68',
  );
}
getSavedNetwork();

window.changeNetwork = async (network: ProviderNetwork) => {
  window.stateObj.provider = new EtherscanProvider(network.internalName, 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');
  window.stateObj.selectedNetwork = { ...network };
  await browser.storage.local.set({
    currentNetworkName: network.internalName,
  });
};

// Listen for requests from the injected provider
browser.runtime.onMessage.addListener(InjectedProviderReceiver);
