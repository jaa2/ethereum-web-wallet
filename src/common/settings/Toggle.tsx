import React from 'react';
import Config from './Config';

const Toggle = function Toggle(props: { configKey: string, label: string, config: Config }) {
  const { configKey, config, label } = props;
  const [checked, setChecked] = React.useState<boolean>(config.getImmediate(configKey, false));
  React.useEffect(() => {
    config.get(configKey, false).then((val: boolean) => {
      setChecked(val);
    });
  }, []);
  return (
    <fieldset>
      <legend className="mt-1">{label}</legend>
      <div className="settings-switch form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            config.set(configKey, e.currentTarget.checked);
            setChecked(e.currentTarget.checked);
          }}
        />
      </div>
    </fieldset>
  );
};

export default Toggle;
