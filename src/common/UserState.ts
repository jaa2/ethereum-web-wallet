import { ethers, Signer } from 'ethers';
import browser from 'webextension-polyfill';

import { BackgroundWindowInterface } from '../../background/background';

/**
 * Indicates the current status of the wallet
 */
export enum WalletStatus {
  // A wallet is not saved
  NO_WALLET,
  // The wallet is saved but has not been decrypted
  WALLET_ENCRYPTED,
  // An active wallet is decrypted and in memory
  WALLET_LOADED,
  // A state in transition
  UNKNOWN,
}

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

  /**
   * Find the current status of the user's saved wallet
   * @returns a WalletStatus value indicating the current status of the wallet
   */
  static async getWalletStatus(): Promise<WalletStatus> {
    const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const { walletState } = backgroundWindow.stateObj;
    const isLoaded = await walletState.willOverwrite();
    if (isLoaded) {
      return (walletState.currentWallet === null) ? WalletStatus.WALLET_ENCRYPTED
        : WalletStatus.WALLET_LOADED;
    }
    return WalletStatus.NO_WALLET;
  }
}
