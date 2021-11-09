import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { faCloudUploadAlt, faKey, faPlus } from '@fortawesome/free-solid-svg-icons';


function ImportSecretPhrase() {
  return (
    <div id= "import-secret-phrase">
      <div id="wallet-setup-header">
        <FontAwesomeIcon className="fa-icon" icon={faEthereum} size="3x" />
        <h1>Icon Here</h1>
      </div>

      <h1>Import Private Key</h1>
    </div>
  );
}

export default ImportSecretPhrase;