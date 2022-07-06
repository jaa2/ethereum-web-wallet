import './CommonScreen.scss';
import React, { ReactElement, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import BackButton from '../common/BackButton';
import ProviderNetwork, { ConnectionType, getProviderNetworks, removeProviderNetwork } from '../common/ProviderNetwork';

function ProviderNetworkEntry(
  network: ProviderNetwork,
  deleteCallback: (name: string) => void,
): ReactElement {
  const {
    displayName, connectionType, networkID, address, internalName, explorerURL,
  } = network;
  return (
    <tr>
      <td>{displayName}</td>
      <td>{ConnectionType[connectionType]}</td>
      <td>{networkID}</td>
      <td>{address || internalName}</td>
      <td>{explorerURL}</td>
      <td>
        <button type="button" className="btn back-icon" onClick={() => deleteCallback(displayName)}>
          <FontAwesomeIcon className="fa-icon" icon={faTrash} size="2x" />
        </button>
      </td>
    </tr>
  );
}

export default function ProviderNetworkManager(): ReactElement {
  const [networks, setNetworks] = React.useState<ProviderNetwork[]>([]);
  useEffect(() => {
    getProviderNetworks().then((savedNetworks) => setNetworks(savedNetworks));
  }, []);
  function deleteNetwork(name: string) {
    removeProviderNetwork(name)
      .then(() => getProviderNetworks())
      .then((savedNetworks) => setNetworks(savedNetworks));
  }
  return (
    <div className="top-container container">
      <BackButton />
      <h1>Providers</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Network ID</th>
            <th scope="col">Address</th>
            <th scope="col">Explorer</th>
            <th scope="col"> </th>
          </tr>
        </thead>
        <tbody>
          {networks.map((network) => ProviderNetworkEntry(network, deleteNetwork))}
        </tbody>
      </table>
      <div>
        <Link to="/AddProviderNetwork">
          <button type="button" className="btn btn-info">Add Network</button>
        </Link>
      </div>
    </div>
  );
}
