import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import './CreateNewWallet.scss';

function CreateNewWallet() {
  return (
    <div id="create-new-wallet">
      <FontAwesomeIcon className="fa-icon" icon={faPlus} size="4x" />
      <h1>Create New Wallet</h1>
      <p className="border_red">
        <h4>Your <b>secret recovery phrase</b> can be used to restore your wallet on a different device. 
            You should write it down and store it in a very safe place. </h4>
        <h4>BEWARE! Anyone who has access to your secret recovery phrase has <b>access to 
            all of the funds in your wallet</b> and can steal them at any time. 
            Do NOT share the secret recovery phrase with anyone, and do not enter it into any website.</h4>
      </p>
    </div>
  );
}

export default CreateNewWallet;