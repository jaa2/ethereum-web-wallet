import React, { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

function ExistingWallet() {
  const [hasExistingWallet, setHasExistingWallet]:
  [string, (hasExistingWallet: string) => void] = React.useState<string>('undefined');

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // This is just to test. This will be updated with wallet logic.
    setHasExistingWallet('false');
  }, []);

  useEffect(() => {
    if (hasExistingWallet !== 'undefined') {
      if (hasExistingWallet === 'true') {
        navigate('/SignIn');
      } else {
        navigate('/WalletSetup');
      }
    }
  }, [hasExistingWallet]);

  return (
    <div />
  );
}

export default ExistingWallet;
