import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

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
        {/* <p id="correct-private-key-info" className="private-key-info">Successful Login!</p> */}
        {/* <div className="form-group">
          <textarea className="form-control is-valid" id="secret-phrase" rows={1} />
          <div className="valid-feedback">Success. This is a valid wallet account!</div>
        </div> */}
        <div className="form-group has-success">
          <input type="text" className="form-control is-valid" id="inputValid" placeholder="Enter Private Key" />
          <div className="valid-feedback">Success!</div>
        </div>
        <Link id="correct-private-key-continue-link" className="link hoverable" to="/CreatePassword" onClick={CorrectPrivateKey}>
          <button type="button" className="btn btn-success">Continue</button>
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
      <FontAwesomeIcon className="fa-icon" icon={faKey} size="4x" />

      <h1>Import Private Key</h1>

      <p>Enter your private key below</p>

      {privateKeyMatchElements}

    </div>

  );
}

export default ImportPrivateKey;
