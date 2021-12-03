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
    },
    {
      displayName: 'Kovan Test Network',
      internalName: 'kovan',
      networkID: 42,
    },
    {
      displayName: 'Rinkeby Test Network',
      internalName: 'rinkeby',
      networkID: 4,
    },
    {
      displayName: 'Goerli Test Network',
      internalName: 'goerli',
      networkID: 5,
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
}
