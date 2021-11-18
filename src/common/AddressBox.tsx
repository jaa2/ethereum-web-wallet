import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import './AddressBox.scss';

export interface IAddressBoxProps {
  address: string;
}

const AddressBox: React.FC<IAddressBoxProps> = (props: IAddressBoxProps) => {
  const { address } = props;

  return (
    <div id="address-box">
      <div id="address-text" className="p-2" data-toggle="tooltip" title={address}>
        {address}
      </div>
      <div className="p-1">
        <FontAwesomeIcon id="icon" className="fa-icon" icon={faCopy} size="2x" onClick={() => { navigator.clipboard.writeText(address); }} data-toggle="tooltip" title="Copy Address to Clipboard" />
      </div>
    </div>
  );
};

export default AddressBox;
