import { ReactElement, useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import ProviderNetwork, { addProviderNetworks, ConnectionType, getProviderNetworks } from '../common/ProviderNetwork';
import UserState from '../common/UserState';
import './CommonScreen.scss';

/**
 * Adds several test networks using Etherscan as the backend
 */
async function addEtherscanNetworks() {
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
      explorerURL: 'https://goerli.etherscan.io',
    },
  ];
  await addProviderNetworks(networks);

  // Update current provider
  const window = await UserState.getBackgroundWindow();
  await window.getSavedNetwork();
}

export default function ProviderNetworkSetup(): ReactElement {
  const navigate: NavigateFunction = useNavigate();
  useEffect(() => {
    getProviderNetworks()
      .then((networks) => networks.length > 0 && navigate('/Home'));
  }, []);
  return (
    <div className="top-container container">
      <h1>Add a Network</h1>
      <div className="mb-2">
        In order to access Ethereum and other blockchains, the wallet must connect to a network
        provider. You can use an existing public node or
        {' '}
        <a href="https://ethereum.org/en/run-a-node/" target="_blank" rel="noreferrer">host your own node</a>
        .
      </div>
      <div>
        <div>
          <Link to="/AddProviderNetwork">
            <button type="button" className="btn btn-info">Add Network</button>
          </Link>
        </div>

        <div className="my-2">
          Alternatively, add some test networks using Etherscan as the backend:
        </div>
        <div>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => addEtherscanNetworks().then(() => navigate('/Home'))}
          >
            Add Testnets using Etherscan API
          </button>
        </div>
      </div>
    </div>
  );
}
