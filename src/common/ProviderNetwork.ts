export enum ConnectionType {
  JSON_RPC = 1,
  WEBSOCKET = 2,
  ETHERSCAN_API = 3,
}

/**
 * Finds a list of known provider networks
 * @returns an array of known provider networks
 */
export function getProviderNetworks(): Array<ProviderNetwork> {
  const networks: Array<ProviderNetwork> = [
    {
      displayName: 'Ropsten Test Network',
      connectionType: ConnectionType.ETHERSCAN_API,
      internalName: 'ropsten',
      networkID: 3,
      explorerURL: 'https://ropsten.etherscan.io',
    },
    {
      displayName: 'Kovan Test Network',
      connectionType: ConnectionType.ETHERSCAN_API,
      internalName: 'kovan',
      networkID: 42,
      explorerURL: 'https://kovan.etherscan.io',
    },
    {
      displayName: 'Rinkeby Test Network',
      connectionType: ConnectionType.ETHERSCAN_API,
      internalName: 'rinkeby',
      networkID: 4,
      explorerURL: 'https://rinkeby.etherscan.io',
    },
    {
      displayName: 'Goerli Test Network',
      connectionType: ConnectionType.ETHERSCAN_API,
      internalName: 'goerli',
      networkID: 5,
      explorerURL: 'https://rinkeby.etherscan.io',
    },
  ];
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
