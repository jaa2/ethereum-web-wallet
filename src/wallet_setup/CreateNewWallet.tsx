import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import './CreateNewWallet.scss';

function NewWalletCreated() {

}

function CreateNewWallet() {
  const [phraseMatchState, setPhraseMatchState]: [string, (matchState: string) => void] = React.useState<string>('empty');

  const [phrase, setPhrase]: [string, (phrase: string) => void] = React.useState<string>('');
  const handlePhrase = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhrase(event.target.value);
  };

  const [confirmPhrase, setConfirmPhrase]: [string, (confirmPhrase: string) => void] = React.useState<string>('');
  const handleConfirmPhrase = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPhrase(event.target.value);
  };

  useEffect(() => {
    // TODO: add more phrase authentication (length, char type, etc.)
    if (confirmPhrase.length === 0) {
      setPhraseMatchState('empty');
    } else if (phrase !== confirmPhrase) {
      setPhraseMatchState('mismatch');
    } else {
      setPhraseMatchState('match');
    }
  }, [phrase, confirmPhrase]);

  let phraseMatchElements: JSX.Element = (<div />);
  // handle additional state where the user's phrase doesn't meet requirements
  if (phraseMatchState === 'match') {
    phraseMatchElements = (
      <div id="create-phrase-match-elements">
        <p id="create-phrase-info-match" className="phrase-info">Success. Your phrases match!</p>
        <Link id="create-phrase-continue-link" className="link hoverable" to="/Home" onClick={NewWalletCreated}>
          <button type="button" className="btn btn-success">Continue</button>
        </Link>
      </div>
    );
  } else if (phraseMatchState === 'mismatch') {
    phraseMatchElements = (
      <div id="create-phrase-match-elements">
        <p id="create-phrase-info-mismatch" className="phrase-info">Uh oh. Your phrases don&apos;t match!</p>
      </div>
    );
  } else {
    phraseMatchElements = (
      <div id="create-phrase-match-elements">
        <p id="create-phrase-info-empty" className="phrase-info" />
      </div>
    );
  }

  return (
    <div id="create-new-wallet">
      <Link id="back-link" className="back-icon link hoverable" to="/WalletSetup">
        <FontAwesomeIcon className="fa-icon" icon={faArrowCircleLeft} size="2x" />
      </Link>
      <div id="align-center">
        <FontAwesomeIcon className="fa-icon" icon={faPlus} size="4x" />
        <h1>Create New Wallet</h1>
        <div className="alert alert-dismissible alert-danger">
          <p>
            Your
            <b> secret recovery phrase</b>
            {' '}
            can be used to restore your wallet on a different device.
            You should write it down and store it in a very safe place.
            {' '}
          </p>
          <p>
            <strong>BEWARE! </strong>
            Anyone who has access to your secret recovery phrase has
            {' '}
            <b>
              access to
              all of the funds in your wallet
            </b>
            {' '}
            and can steal them at any time.
            Do NOT share the secret recovery phrase with anyone,
            and do not enter it into any website.
          </p>
        </div>
        <div className="form-group">
          <label htmlFor="create-phrase-phrase-input" className="form-label mt-4">
            Secret Recovery Phrase
            <input className="form-control" id="create-phrase-phrase-input" type="phrase" name="phrase" onChange={handlePhrase} />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="create-phrase-confirm-phrase-input" className="form-label mt-4">
            Confirm Secret Recovery Phrase
            <input className="form-control" id="create-phrase-confirm-phrase-input" type="phrase" name="confirm phrase" onChange={handleConfirmPhrase} />
          </label>
        </div>
        {phraseMatchElements}
      </div>
    </div>
  );
}

export default CreateNewWallet;
