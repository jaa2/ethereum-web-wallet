import React, { useEffect } from 'react';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import './CreateNewWallet.scss';

function NewWalletCreated() {
  console.log("New Wallet Created!");
}

function CreateNewWallet() {
  const [phraseMatchState, setPhraseMatchState]: [string, (matchState: string) => void] = React.useState<string>("empty");

  const [phrase, setPhrase]: [string, (phrase: string) => void] = React.useState<string>("");
  const handlePhrase = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhrase(event.target.value);
  }

  const [confirmPhrase, setConfirmPhrase]: [string, (confirmPhrase: string) => void] = React.useState<string>("");
  const handleConfirmPhrase = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPhrase(event.target.value);
  }

  useEffect(() => {
    // TODO: add more phrase authentication (length, char type, etc.)
    if (confirmPhrase.length === 0) {
      setPhraseMatchState("empty");
    } else if (phrase !== confirmPhrase) {
      setPhraseMatchState("mismatch");
    } else {
      setPhraseMatchState("match");
    }
  }, [phrase, confirmPhrase]);

  let phraseMatchElements: JSX.Element = ( <div /> );
  // handle additional state where the user's phrase doesn't meet requirements
  if (phraseMatchState === "match") {
    phraseMatchElements = (
      <div id="create-phrase-match-elements">
        <p id="create-phrase-info-match" className="phrase-info" >Success. Your phrases match!</p>
        <Link id="create-phrase-continue-link" className="link hoverable" to="/Home" onClick={NewWalletCreated} >
          <h4>Continue</h4>
        </Link>
      </div>
    );
  } else if (phraseMatchState === "mismatch") {
    phraseMatchElements = (
    <div id="create-phrase-match-elements">
      <p id="create-phrase-info-mismatch" className="phrase-info">Uh oh. Your phrases don't match!</p>
    </div>
    );
  } else {
    phraseMatchElements = (
      <div id="create-phrase-match-elements">
        <p id="create-phrase-info-empty" className="phrase-info"></p>
      </div>
    );
  }
  
  return (
    <div id="create-new-wallet">
      <Link id="back-button" to="/Home"> 
      <button className="back-button">Back</button>
      </Link>
      <FontAwesomeIcon className="fa-icon" icon={faPlus} size="4x" />
      <h1>Create New Wallet</h1>
      <p className="border_red">
        <h4>Your <b>secret recovery phrase</b> can be used to restore your wallet on a different device. 
            You should write it down and store it in a very safe place. </h4>
        <h4>BEWARE! Anyone who has access to your secret recovery phrase has <b>access to 
            all of the funds in your wallet</b> and can steal them at any time. 
            Do NOT share the secret recovery phrase with anyone, and do not enter it into any website.</h4>
      </p>
      <div id="create-phrase-entry" className="field-entry">
          <h5 id="create-phrase-phrase-label">Phrase</h5>
          <input id="create-phrase-phrase-input" type="phrase" name="phrase" onChange={handlePhrase} />
          <h5 id="create-phrase-confirm-phrase-label">Repeat your secret recovery phrase below to confirm it is written down correctly:</h5>
          <input id="create-phrase-confirm-phrase-input" type="phrase" name="confirm phrase" onChange={handleConfirmPhrase} />
      </div>
      {phraseMatchElements}
    </div>
  );
}

export default CreateNewWallet;