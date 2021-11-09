import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import './ImportSecretPhrase.scss'

function ImportSecretPhrase() {
  return (
    <div>
      <Link id="back-link" className="back-icon link hoverable" to="/WalletSetup">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div id="import-secret-phrase">
        <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="4x" />
        <h1>Import Secret Recovery Phrase</h1>
        <h3>Enter your 12-word secret recovery phrase below.</h3>
        <textarea cols={40} rows={4}></textarea>

        <div id="match-elements">
          <p id="info-match" className="info" >Success. This is a valid wallet account!</p>
          <Link to="/CreatePassword">
            <button className="bottom-button">Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ImportSecretPhrase;