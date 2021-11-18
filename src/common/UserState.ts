import { ethers, Signer } from 'ethers';
import browser from 'webextension-polyfill';

import { BackgroundWindowInterface } from '../../background/background';

/**
 * Class containing common state functions
 */
export default class UserState {
  /**
    * Fetch the user's address, even if the wallet is encrypted
    * @returns the user's address, or null if no wallet is found at all
    */
  static async getAddress(): Promise<string | null> {
    const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const signer: Signer | null = await backgroundWindow.stateObj.walletState.getWalletSafe();
    if (signer === null) {
      return null;
    }
    return ethers.utils.getAddress(await signer.getAddress());
  }
}
