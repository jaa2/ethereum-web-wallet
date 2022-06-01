import {
  JsonRpcProvider, WebSocketProvider, EtherscanProvider, Provider,
} from '@ethersproject/providers';
import { Wallet } from 'ethers';
import browser from 'webextension-polyfill';
import ProviderNetwork, { ConnectionType, getProviderNetworks } from '../src/common/ProviderNetwork';
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

async function changeNetwork(network: ProviderNetwork) {
  if (window.stateObj.provider !== null) {
    console.log(window.stateObj.provider.listenerCount());
    window.stateObj.provider.removeAllListeners();
  }
  switch (network.connectionType) {
    case ConnectionType.JSON_RPC:
      if (network.address === undefined) {
        throw new Error('Undefined network address for a JSON-RPC connection type');
      }
      window.stateObj.provider = new JsonRpcProvider(network.address);
      break;
    case ConnectionType.WEBSOCKET:
      if (network.address === undefined) {
        throw new Error('Undefined network address for a WebSocket connection type');
      }
      window.stateObj.provider = new WebSocketProvider(network.address);
      break;
    case ConnectionType.ETHERSCAN_API:
      window.stateObj.provider = new EtherscanProvider(network.internalName, 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');
      break;
    default:
      throw new Error('changeNetwork: Unknown connection type');
  }
  window.stateObj.selectedNetwork = { ...network };
  await browser.storage.local.set({
    currentNetworkName: network.displayName,
  });
}

window.changeNetwork = changeNetwork;

window.stateObj.walletState.loadEncrypted()
  .catch((reason: string) => {
    const myConsole: Console = console;
    myConsole.warn(`[Background] Could not load encrypted: ${reason}`);
  });

window.connectWallet = async () => {
  window.stateObj.walletState.currentWallet = (await
  window.stateObj.walletState.getWallet() as Wallet).connect(window.stateObj.provider as Provider);
};

async function getSavedNetwork(loadPendingTransactions: boolean = false) {
  const record = await browser.storage.local.get('currentNetworkName');
  let selectedNetworkIndex: number = 0;
  if ('currentNetworkName' in record) {
    // Find network by name
    const selectedNetworkName: string = record.currentNetworkName;
    const possibleNetworks = await getProviderNetworks();
    for (let i = 0; i < possibleNetworks.length; i += 1) {
      if (possibleNetworks[i].displayName === selectedNetworkName) {
        selectedNetworkIndex = i;
        break;
      }
    }
  }

  await changeNetwork((await getProviderNetworks())[selectedNetworkIndex]);

  if (loadPendingTransactions) {
    window.stateObj.pendingTransactionStore.load(window.stateObj.provider);
  }
}

getSavedNetwork();
