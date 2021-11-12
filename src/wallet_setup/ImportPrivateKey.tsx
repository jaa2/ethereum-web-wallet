import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';

import './ImportPrivateKey.scss';

function CorrectPrivateKey() {

}

function ImportPrivateKey() {
  // comments removed use of hooks
  // const [privateKeyMatchState, setPrivateKeyMatchState]:
  //    [string, (matchState: string) => void] = React.useState<string>('empty');
  const privateKeyMatchState: string = 'match'; // this is temporary, unsure of if hooks will be used

  // const [privateKey, setPrivateKey]:
  //    [string, (privateKey: string) => void] = React.useState<string>('');
  // const handlePrivateKey = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPrivateKey(event.target.value);
  // };

  let privateKeyMatchElements: JSX.Element = (<div />);
  // handle additional state where the user's password doesn't meet requirements
  if (privateKeyMatchState === 'match') {
    privateKeyMatchElements = (
      <div id="correct-private-key">
        <p id="correct-private-key-info" className="private-key-info">Successful Login!</p>
        <Link id="correct-private-key-continue-link" className="link hoverable" to="/Home" onClick={CorrectPrivateKey}>
          <h4>Continue</h4>
        </Link>
      </div>
    );
  } else {
    privateKeyMatchElements = (
      <div id="wrong-private-key">
        <p id="wrong-private-key-info" className="private-key-info">Wrong Private Key!</p>
      </div>
    );
  }

  return (
    <div id="import-private-key">
      <FontAwesomeIcon className="fa-icon" icon={faUserSecret} size="4x" />

      <h1>Import Private Key</h1>

      <h4>Enter your private key below</h4>
      <div id="enter-private-key-entry" className="field-entry">
        {/* <input id="private-key-input" type="text" name="privateKey"
              onChange={handlePrivateKey} /> */}
        <input id="private-key-input" type="text" name="privateKey" />
      </div>

      {privateKeyMatchElements}

      <Link to="/CreatePassword">
        <button className="continue-button" type="button">Continue</button>
      </Link>

    </div>

  );
}

export default ImportPrivateKey;
