import React, { useContext, useEffect } from 'react';
import { NavigateFunction, useNavigate, useLocation } from 'react-router-dom';

import { WindowType, WindowTypeContext } from './common/OpenNewWindow';
import UserState, { WalletStatus } from './common/UserState';

const ExistingWallet = function ExistingWallet() {
  const { setWindowType } = useContext(WindowTypeContext);
  const location = useLocation();

  // If extension popup, set global state
  const locSearch = location.search ? location.search : window.location.search;
  if (locSearch) {
    const searchParams = new URLSearchParams(locSearch);
    const newWindowType = searchParams.get('windowType');
    if (newWindowType === 'popup') {
      setWindowType(WindowType.POPUP);
    }
  }

  const [walletStatus, setWalletStatus]:
  [WalletStatus, (walletStatus: WalletStatus) => void] = React.useState<
  WalletStatus>(WalletStatus.UNKNOWN);

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // Find the current status
    UserState.getWalletStatus()
      .then((newWalletStatus: WalletStatus) => setWalletStatus(newWalletStatus));
  }, []);

  useEffect(() => {
    if (walletStatus !== WalletStatus.UNKNOWN) {
      switch (walletStatus) {
        case WalletStatus.WALLET_ENCRYPTED:
          navigate('/Unlock');
          break;
        case WalletStatus.NO_WALLET:
          navigate('/WalletSetup');
          break;
        case WalletStatus.WALLET_LOADED:
          navigate('/Home');
          break;
        default:
          // Should not happen
          console.error('Unknown wallet status:', walletStatus); // eslint-disable-line
          navigate('/Home');
          break;
      }
    }
  }, [walletStatus]);

  return (
    <div />
  );
};

export default ExistingWallet;
