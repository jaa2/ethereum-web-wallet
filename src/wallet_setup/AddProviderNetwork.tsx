import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import './CommonScreen.scss';

export default function AddProviderNetwork() {
  const navigate = useNavigate();
  return (
    <div className="top-container container">
      <button type="button" className="btn back-icon" onClick={() => navigate(-1)}>
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </button>
      <h1>Add Network</h1>
      <form className="container-md mt-2" onSubmit={() => {}}>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="network-name">Network Name</label>
          <input type="text" id="network-name" className="form-control" placeholder="Name" />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="rpc-url">RPC URL</label>
          <input type="url" id="rpc-url" className="form-control" placeholder="http://..." />
        </div>
        <div className="form-group mb-3">
          <label className="form-label" htmlFor="network-id">Network ID</label>
          <input type="number" min="0" step="1" id="network-id" className="form-control" placeholder="1" />
        </div>
      </form>
    </div>
  );
}
