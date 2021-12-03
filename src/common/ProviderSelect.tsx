import React, { ReactElement, useEffect } from 'react';
import { getProviderNetworks } from './ProviderNetwork';
import UserState from './UserState';

export interface IHelpModalProps {
  title: string;
  description: string;
}

/**
 * Changes the provider's network by name
 * @param newNetwork New network's internal name
 * @returns void
 */
function changeNetwork(newNetwork: string) {
  if (newNetwork === '') {
    return;
  }
  UserState.getBackgroundWindow()
    .then((window) => window.changeNetwork(getProviderNetworks().filter(
      (network) => network.internalName === newNetwork,
    )[0]))
    .then(() => {
      window.location.reload();
    });
}

const ProviderSelect = function ProviderSelect() {
  const [selectedNetwork, setSelectedNetwork] = React.useState<string>();

  useEffect(() => {
    UserState.getBackgroundWindow().then((window) => {
      const network = window.stateObj.selectedNetwork;
      if (network !== undefined) {
        setSelectedNetwork(network.internalName);
      }
    });
  }, []);

  const networks = getProviderNetworks();
  const options: Array<ReactElement> = [];
  for (let i = 0; i < networks.length; i += 1) {
    options.push(
      <option
        value={networks[i].internalName}
        selected={networks[i].internalName === selectedNetwork}
      >
        {networks[i].displayName}
      </option>,
    );
  }

  return (
    <select
      id="network-input"
      name="network"
      className="form-select"
      defaultValue={selectedNetwork}
      onChange={(e) => { changeNetwork(e.currentTarget.value); }}
    >
      {options}
    </select>
  );
};

export default ProviderSelect;
