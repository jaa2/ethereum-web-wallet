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

      <h4>Enter your private key below</h4>
      

      



      



    </div>
  );
}

function UserInputPhrase() {
  var   num1= ((document.getElementById("num1") as HTMLInputElement).value);
  var   num2= ((document.getElementById("num2") as HTMLInputElement).value);
  var result=parseInt(num1)+parseInt(num2);
  console.log(result);
}

export default ImportSecretPhrase;