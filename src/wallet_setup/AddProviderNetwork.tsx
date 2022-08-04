import React from 'react';
import './CommonScreen.scss';
import { useNavigate } from 'react-router';
import ProviderNetwork, { ConnectionType, addProviderNetworks, getProviderNetworks } from '../common/ProviderNetwork';
import BackButton from '../common/BackButton';
import UserState from '../common/UserState';

async function addNetwork(name: string, networkID: number, rpcUrl: string, explorerURL?: string) {
  const numPrevNetworks = (await getProviderNetworks()).length;
  const pn: ProviderNetwork = {
    displayName: name,
    connectionType: ConnectionType.JSON_RPC,
    networkID,
    address: rpcUrl,
    explorerURL,
  };
  await addProviderNetworks([pn]);

  if (numPrevNetworks === 0) {
    const window = await UserState.getBackgroundWindow();
    await window.getSavedNetwork();
  }
}

export default function AddProviderNetwork() {
  const [name, setName]: [string, (name: string) => void] = React.useState<string>('');
  const [url, setURL]: [string, (url: string) => void] = React.useState<string>('');
  const [explorerURL, setExplorerURL]: [string, (url: string) => void] = React.useState<string>('');
  const [networkID, setNetworkID]:
  [number, (networkID: number) => void] = React.useState<number>(1);
  const navigate = useNavigate();
  return (
    <div className="top-container container">
      <BackButton />
      <h1>Add Network</h1>
      <form
        className="container-md mt-2"
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          addNetwork(name, networkID, url, explorerURL !== '' ? explorerURL : undefined)
            // Close modal
            .then(() => navigate(-1));
        }}
      >
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="network-name">
            Network Name
          </label>
          <input
            type="text"
            id="network-name"
            className="form-control"
            placeholder="Name"
            onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)
          }
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="network-id">
            Network ID
          </label>
          <input
            type="number"
            min="0"
            step="1"
            id="network-id"
            className="form-control"
            placeholder="1"
            onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => setNetworkID(Number(event.target.value))
          }
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="rpc-url">
            RPC URL
          </label>
          <input
            type="url"
            id="rpc-url"
            className="form-control"
            placeholder="https://..."
            onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => setURL(event.target.value)
          }
            required
          />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="network-id">
            Explorer URL (Optional)
          </label>
          <input
            type="url"
            id="explorer-url"
            className="form-control"
            placeholder="https://..."
            onChange={
            (event: React.ChangeEvent<HTMLInputElement>) => setExplorerURL(event.target.value)
          }
          />
        </div>
        <button className="btn btn-info" type="submit">Add Network</button>
      </form>
    </div>
  );
}
