import browser from 'webextension-polyfill';

export enum ConnectionType {
  JSON_RPC = 1,
  WEBSOCKET = 2,
  ETHERSCAN_API = 3,
}

export async function addProviderNetworks(networks: ProviderNetwork[]) {
  let savedNetworks: ProviderNetwork[] = [];
  savedNetworks = (await browser.storage.local.get({ savedNetworks: [] })).savedNetworks;
  savedNetworks.push(...networks);
  await browser.storage.local.set({ savedNetworks });
}

export async function removeProviderNetwork(name: string) {
  let savedNetworks: ProviderNetwork[] = [];
  savedNetworks = (await browser.storage.local.get({ savedNetworks: [] })).savedNetworks;
  savedNetworks = savedNetworks.filter((network) => (network.displayName !== name));
  await browser.storage.local.set({ savedNetworks });
}

/**
 * Finds a list of known provider networks
 * @returns an array of known provider networks
 */
export async function getProviderNetworks(): Promise<Array<ProviderNetwork>> {
  const networks: Array<ProviderNetwork> = [];

  // Load saved networks
  let savedNetworks: ProviderNetwork[] = [];
  savedNetworks = (await browser.storage.local.get({ savedNetworks: [] })).savedNetworks;

  for (let i = 0; i < savedNetworks.length; i += 1) {
    networks.push(savedNetworks[i]);
  }

  return networks;
}

export default interface ProviderNetwork {
  displayName: string;
  connectionType: ConnectionType;
  // Name of the network to pass to a hosted provider. Not defined if a hosted provider is not used
  internalName?: string;
  // Address if an address-based connection type is used
  address?: string;
  // Network ID
  networkID: number;
  // Explorer link
  explorerURL?: string;
}
