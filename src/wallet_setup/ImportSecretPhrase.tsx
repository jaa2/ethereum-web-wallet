import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import './ImportSecretPhrase.scss';

function ImportSecretPhrase() {
  return (
    <div className="container">
      <Link className="back-icon" to="/WalletSetup">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div className="container">
        <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="4x" />
        <h1>Import Secret Recovery Phrase</h1>
        <p>Enter your 12-word secret recovery phrase below.</p>
        <div className="form-group">
          <textarea className="form-control is-valid" id="secret-phrase" rows={4} />
          <div className="valid-feedback">Success. This is a valid wallet account!</div>
        </div>
        <Link to="/CreatePassword">
          <button type="button" className="btn btn-success">Continue</button>
        </Link>
      </div>
    </div>
  );
}

export default ImportSecretPhrase;
