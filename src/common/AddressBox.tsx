import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import './AddressBox.scss';

export interface IAddressBoxProps {
  address: string;
}

const AddressBox: React.FC<IAddressBoxProps> = function AddressBox(props: IAddressBoxProps) {
  const { address } = props;

  return (
    <button type="button" className="btn btn-info" id="address-box" onClick={() => { navigator.clipboard.writeText(address); }}>
      <div id="address-text" className="p-2" data-toggle="tooltip" title={address}>
        {address}
      </div>
      <div className="p-1">
        <FontAwesomeIcon id="icon" color="#FFFFFF" icon={faCopy} size="2x" data-toggle="tooltip" title="Copy Address to Clipboard" />
      </div>
    </button>
  );
};

export default AddressBox;
