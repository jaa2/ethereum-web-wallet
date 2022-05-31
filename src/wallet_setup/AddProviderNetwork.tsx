import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import './CommonScreen.scss';
import React from 'react';

async function addNetwork(name: string, networkID: number, rpcUrl: string, explorerURL?: string) {
  console.log(name, networkID, rpcUrl, explorerURL); // eslint-disable-line
}

export default function AddProviderNetwork() {
  const navigate = useNavigate();
  const [name, setName]: [string, (name: string) => void] = React.useState<string>('');
  const [url, setURL]: [string, (url: string) => void] = React.useState<string>('');
  const [explorerURL, setExplorerURL]: [string, (url: string) => void] = React.useState<string>('');
  const [networkID, setNetworkID]:
  [number, (networkID: number) => void] = React.useState<number>(1);
  return (
    <div className="top-container container">
      <button type="button" className="btn back-icon" onClick={() => navigate(-1)}>
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </button>
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
