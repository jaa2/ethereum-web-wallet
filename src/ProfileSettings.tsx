import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faEdit, faHome,
} from '@fortawesome/free-solid-svg-icons';
import './ProfileSettings.scss';
// import { faUserCircle, faHome } from '@fortawesome/free-solid-svg-icons';

function ProfileSettings() {
  return (
    <div className="profile-settings">
      <div className="container">
        <Link className="back-icon" to="/WalletSetup">
          <FontAwesomeIcon className="back-icon" icon={faHome} size="2x" />
        </Link>
        <h1>Profile & Settings</h1>
      </div>
      {/* <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="4x" /> */}
      <div className="content-container">
        <div className="profile-left-section">
          <div id="profile-picture-edit">
            <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="7x" />
            <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
          </div>
          <div id="profile-name-edit">
            <text>Name</text>
            <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
          </div>
          <button type="button">0x51912454541...</button>
        </div>
        <div id="profile-right-section">
          <div id="delay-selection">
            <div id="delay-selection-content">
              {/* <h5>Delay Time</h5> */}
              <legend className="mt-1">Delay Time</legend>
            </div>
            {/* <div id="delay-selection-content">
              <select id="to-address-input" name="to-address">
                <option>5 sec</option>
                <option>10 sec</option>
                <option>20 sec</option>
                <option>30 sec</option>
              </select>
            </div> */}
            <form>
              <fieldset>
                <div className="form-group">
                  <select className="form-select" id="exampleSelect1">
                    <option>5 sec</option>
                    <option>10 sec</option>
                    <option>20 sec</option>
                    <option>30 sec</option>
                  </select>
                </div>
              </fieldset>
            </form>
          </div>
          <div id="dark-mode">
            {/* <h5>Dark Mode</h5> */}
            <fieldset>
              <legend className="mt-1">Dark Mode</legend>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
              </div>
            </fieldset>
          </div>
        </div>
      </div>
      <div className="container">
        <button type="button" className="btn btn-outline-danger">Delete Account</button>
      </div>
    </div>
  );
  //   <div id="profile-settings">

  // <div id="profile-left-section">
  //   <div id="settings-nav">
  //     <Link id="wallet-setup-import-key" className="link hoverable" to="/Home">
  //       <FontAwesomeIcon className="fa-icon" icon={faHome} size="1x" />
  //       <h6>Home</h6>
  //     </Link>
  //     <Link id="wallet-setup-import-key" className="link hoverable" to="/SignIn">
  //       <FontAwesomeIcon className="fa-icon" icon={faLock} size="1x" />
  //       <h6>SignIn</h6>
  //     </Link>
  //   </div>
  //   <div id="profile-picture-edit">
  //     <FontAwesomeIcon className="fa-icon" icon={faUserCircle} size="7x" />
  //     <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
  //   </div>

  // //   <div id="profile-name-edit">
  // //     <text>Name</text>
  // //     <FontAwesomeIcon className="fa-icon" icon={faEdit} size="1x" />
  // //   </div>
  // //   <button type="button">0x51912454541...</button>
  // // </div>

  //     <div id="profile-right-section">
  //       <h3>Profile & Settings</h3>
  //       <div id="delay-selection">
  //         <div id="delay-selection-content">
  //           <h5>Delay Time</h5>
  //         </div>
  //         <div id="delay-selection-content">
  //           <select id="to-address-input" name="to-address">
  //             <option>5 sec</option>
  //             <option>10 sec</option>
  //             <option>20 sec</option>
  //             <option>30 sec</option>
  //           </select>
  //         </div>
  //       </div>
  //       <div id="dark-mode">
  //         <div id="dark-mode-content">
  //           <h5>Dark Mode</h5>
  //         </div>
  //         <div id="dark-mode-content">
  //           <input type="checkbox" />
  //         </div>
  //         {/* <span id="slider"></span> */}
  //       </div>
  //       <button type="button">Delete Account</button>
  //     </div>
  //   </div>
  // );
}

export default ProfileSettings;
// import { Link } from 'react-router-dom';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCloudUploadAlt, faHome } from '@fortawesome/free-solid-svg-icons';

// import './ProfileSettings.scss';

// function ProfileSettings() {
//   return (
//     <div className="container">
//       <Link className="back-icon" to="/WalletSetup">
//         <FontAwesomeIcon className="fa-icon" icon={faHome} size="2x" />
//       </Link>
//       <div className="container">
//         <FontAwesomeIcon className="fa-icon" icon={faCloudUploadAlt} size="4x" />
//         <h1>Import Secret Recovery Phrase</h1>
//         <p>Enter your 12-word secret recovery phrase below.</p>
//         <div className="form-group">
//           <textarea className="form-control is-valid" id="secret-phrase" rows={4} />
//           <div className="valid-feedback">Success. This is a valid wallet account!</div>
//         </div>
//         <Link to="/CreatePassword">
//           <button type="button" className="btn btn-success">Continue</button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default ProfileSettings;
