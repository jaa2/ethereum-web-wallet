import { ethers } from 'ethers';
import React from 'react';
import Config from '../common/settings/Config';

const DataField = function DataField(props: { initialData: string }) {
  const { initialData } = props;
  const config: Config = new Config();
  const [visible, setVisible] = React.useState<boolean>(config.getImmediate('showDataField', false));

  const [validData, setValidData] = React.useState<boolean>(true);
  let className = 'form-control';
  let feedback = null;
  if (!validData) {
    className += ' is-invalid';
    feedback = <div className="invalid-feedback">Please enter a hex data string.</div>;
  }

  React.useEffect(() => {
    config.get('showDataField', false).then((val) => {
      setVisible(val);
    });
  }, []);

  return (
    <div className="form-group" hidden={!visible}>
      <label className="col-form-label mt-4" htmlFor="dataField">Data</label>
      <textarea
        id="dataField"
        className={className}
        rows={3}
        defaultValue={initialData}
        placeholder="0x"
        onChange={
          (e) => {
            setValidData(ethers.utils.isBytesLike(e.currentTarget.value.trim()));
          }
        }
      />
      {feedback}
    </div>
  );
};

export default DataField;
