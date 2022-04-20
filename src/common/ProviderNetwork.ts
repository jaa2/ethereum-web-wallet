/**
 * Finds a list of known provider networks
 * @returns an array of known provider networks
 */
export function getProviderNetworks(): Array<ProviderNetwork> {
  const networks: Array<ProviderNetwork> = [
    {
      displayName: 'Ropsten Test Network',
      internalName: 'ropsten',
      networkID: 3,
      explorerURL: 'https://ropsten.etherscan.io',
    },
    {
      displayName: 'Kovan Test Network',
      internalName: 'kovan',
      networkID: 42,
      explorerURL: 'https://kovan.etherscan.io',
    },
    {
      displayName: 'Rinkeby Test Network',
      internalName: 'rinkeby',
      networkID: 4,
      explorerURL: 'https://rinkeby.etherscan.io',
    },
    {
      displayName: 'Goerli Test Network',
      internalName: 'goerli',
      networkID: 5,
      explorerURL: 'https://rinkeby.etherscan.io',
    },
  ];
  return networks;
}

export default interface ProviderNetwork {
  displayName: string;
  // Name of the network to pass to a hosted provider, or null if a hosted provider is not used
  internalName?: string;
  // Network ID
  networkID: number;
  // Explorer link
  explorerURL?: string;
}
