import React, { ReactElement, useEffect } from 'react';
import ProviderNetwork, { getProviderNetworks } from './ProviderNetwork';
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
  (async function doChangeNetwork() {
    const backgroundWindow = await UserState.getBackgroundWindow();
    await backgroundWindow.changeNetwork((await getProviderNetworks()).filter(
      (network) => network.displayName === newNetwork,
    )[0]);
    window.location.reload();
  }());
}

const ProviderSelect = function ProviderSelect() {
  const [selectedNetwork, setSelectedNetwork] = React.useState<string>();
  const [networks, setNetworks] = React.useState<ProviderNetwork[]>([]);

  useEffect(() => {
    getProviderNetworks().then((providerNetworks) => {
      setNetworks(providerNetworks);
    })
      .then(() => {
        UserState.getBackgroundWindow().then((window) => {
          const network = window.stateObj.selectedNetwork;
          if (network !== undefined) {
            setSelectedNetwork(network.displayName);
          }
        });
      });
  }, []);

  useEffect(() => {
  }, []);

  const options: Array<ReactElement> = [];
  for (let i = 0; i < networks.length; i += 1) {
    options.push(
      <option
        value={networks[i].displayName}
        selected={networks[i].displayName === selectedNetwork}
      >
        {networks[i].displayName}
      </option>,
    );
  }

  return (
    <select
      id="network-input"
      name="network"
      className="form-select network-select"
      defaultValue={selectedNetwork}
      onChange={(e) => { changeNetwork(e.currentTarget.value); }}
    >
      {options}
    </select>
  );
};

export default ProviderSelect;
