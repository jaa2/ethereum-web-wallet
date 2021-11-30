import { Provider } from '@ethersproject/providers';
import { ethers, Signer, Wallet } from 'ethers';
import browser from 'webextension-polyfill';

import { BackgroundWindowInterface } from '../../background/background';
import PendingTransactionStore from '../../background/PendingTransactionStore';
import WalletState from '../../background/WalletState';

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

  /**
   * Find the WalletState object of the wallet
   * @returns a WalletState object
   */
  static async getWalletState(): Promise<WalletState> {
    const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const { walletState } = backgroundWindow.stateObj;
    return walletState;
  }

  /**
   * Gets a wallet that is connected to the background window's currently selected provider
   * @returns A connected wallet
   */
  static async getConnectedWallet(): Promise<Wallet> {
    let wallet = await (await UserState.getWalletState()).getWallet();
    if (wallet === null) {
      return Promise.reject(new Error('Wallet is null'));
    }
    const provider = await UserState.getProvider();
    if (provider === null) {
      return Promise.reject(new Error('Provider is null'));
    }
    wallet = wallet.connect(provider);
    return wallet;
  }

  /**
   * Find the PendingTransactionStore of the wallet
   * @returns a PendingTransactionStore object
   */
  static async getPendingTxStore(): Promise<PendingTransactionStore> {
    const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const { pendingTransactionStore } = backgroundWindow.stateObj;
    return pendingTransactionStore;
  }

  /**
   * Find the current provider
   * @returns a Provider object
   */
  static async getProvider(): Promise<Provider | null> {
    const backgroundWindow: BackgroundWindowInterface = await browser.runtime.getBackgroundPage();
    const { provider } = backgroundWindow.stateObj;
    return provider;
  }
}
