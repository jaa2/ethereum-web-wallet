import { ethers } from 'ethers';
import React from 'react';
import Config from '../common/settings/Config';

const DataField = function DataField(props: {
  initialData: string,
  defaultVisible: undefined | boolean
}) {
  const { initialData, defaultVisible } = props;
  const config: Config = new Config();
  const [visible, setVisible] = React.useState<boolean>(
    defaultVisible !== undefined ? defaultVisible : config.getImmediate('showDataField', false),
  );

  const [validData, setValidData] = React.useState<boolean>(true);
  let className = 'form-control';
  let feedback = null;
  if (!validData) {
    className += ' is-invalid';
    feedback = <div className="invalid-feedback">Please enter a hex data string.</div>;
  }

  React.useEffect(() => {
    if (defaultVisible === undefined) {
      config.get('showDataField', false).then((val) => {
        setVisible(val);
      });
    }
  }, []);

  return (
    <div
      key={defaultVisible !== undefined ? defaultVisible.toString() : 'undefined'}
      className="form-group"
      hidden={!visible && !defaultVisible}
    >
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
