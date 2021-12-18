import { Wallet } from '@ethersproject/wallet';
import { ethers, Signer, VoidSigner } from 'ethers';
import { storageVersion, WalletStorage } from './WalletStorage';

/**
 * A class that abstracts loading and handling the user's wallet
 * - Creating a wallet and encrypting it with a password
 * - Local storage of encrypted wallet data
 * - Accessing the wallet object directly
 */
export default class WalletState {
  // StorageArea from which state is loaded/saved
  storageArea: WalletStorage;

  // If non-null, a valid wallet object is available
  currentWallet: Wallet | null = null;

  // If true, the encrypted local storage contents have been loaded into memory
  isStateLoaded: boolean = false;

  // Stores the encrypted wallet JSON, if it has been loaded
  encryptedWalletJSON: string | null = null;

  constructor(storageArea: WalletStorage) {
    this.storageArea = storageArea;
  }

  /**
     * @returns true if saving a new wallet would overwrite an existing one
     */
  async willOverwrite(): Promise<boolean> {
    // Try to load wallet data. If there is any, don't proceed with wallet creation
    let hasWalletData = false;
    await this.loadEncrypted()
      .then(() => {
        hasWalletData = true;
      })
      .catch((reason: Error) => {
        if (reason.message !== 'Not all storage values found') {
          hasWalletData = true;
        }
      });

    return hasWalletData;
  }

  /**
     * Get the wallet object for an immediate operation.
     * This function is dangerous, as the object it returns can be used to sign transactions.
     * @returns A wallet object, if it exists
     */
  async getWallet(): Promise<Wallet | null> {
    return this.currentWallet;
  }

  /**
     * Get the wallet object for an immediate operation.
     * @returns A wallet object, if it exists
     */
  async getWalletSafe(): Promise<Signer | null> {
    if (this.currentWallet !== null) {
      return new VoidSigner(this.currentWallet.address);
    } if (this.encryptedWalletJSON !== null) {
      try {
        const jobj: any = JSON.parse(this.encryptedWalletJSON);
        if ('address' in jobj) {
          return new VoidSigner(jobj.address as string);
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
     * Load a saved web wallet
     * @returns A promise that resolves if a wallet was found and loaded, rejecting otherwise
     */
  loadEncrypted(): Promise<void> {
    if (this.isStateLoaded) {
      // The state is already loaded
      return Promise.resolve();
    }

    const keysToFind: Array<string> = ['storageVersion', 'currentWallet'];
    return this.storageArea.get(keysToFind)
      .then((val: Record<string, any>) => {
        const allFound: boolean = keysToFind.map((key: string) => Object.keys(val).includes(key))
          .reduce((prev: boolean, cur: boolean) => prev && cur);
        if (!allFound) {
          return Promise.reject(new Error('Not all storage values found'));
        }
        if (val.storageVersion !== storageVersion) {
          return Promise.reject(new Error('Storage version incompatible'));
        }
        this.encryptedWalletJSON = val.currentWallet;
        this.isStateLoaded = true;
        return Promise.resolve();
      })
      .catch((reason) => Promise.reject(reason));
  }

  /**
     * Attempts to decrypt an encrypted wallet. This function will have a noticeable
     * (multi-second) delay because of the extensive compute and memory resources used,
     * which make brute-force cracking more difficult.
     * @param password Password to the wallet
     * @param progressCallback Callback function accepting a number between 0 and 1,
     * the progress of decrypting the wallet.
     */
  async decryptWallet(password: string, progressCallback?: { (progress: number): any }):
  Promise<void> {
    if (this.encryptedWalletJSON === null) {
      // Load encrypted wallet information if it hasn't already been loaded
      await this.loadEncrypted();
      if (this.encryptedWalletJSON === null) {
        return Promise.reject(new Error('No stored wallet exists'));
      }
    }

    return Wallet.fromEncryptedJson(this.encryptedWalletJSON, password, progressCallback)
      .then((wallet) => {
        // Success!
        this.currentWallet = wallet;
      });
  }

  /**
     * Creates a new random wallet
     * @param overwrite If true, a new wallet will be created even if one already exists
     * @param privateKey If non-null, specifies the private key of the wallet
     * @returns true if the action succeeded following the overwrite argument
     */
  async createWallet(overwrite: boolean, privateKey: string | null): Promise<boolean> {
    if (!overwrite && (await this.willOverwrite())) {
      return false;
    }

    // Create the new wallet
    if (privateKey === null) {
      this.currentWallet = Wallet.createRandom();
    } else {
      this.currentWallet = new ethers.Wallet(privateKey);
    }
    return true;
  }

  /**
     * Creates a wallet from a secret recovery phrase
     * @param overwrite If true, a new wallet will be created even if one already exists
     * @param phrase The secret recovery phrase ('mnemonic')
     * @returns true if the action succeeded following the overwrite argument
     */
  async createWalletFromPhrase(overwrite: boolean, phrase: string): Promise<boolean> {
    if (!overwrite && (await this.willOverwrite())) {
      return false;
    }

    // Create the new wallet
    this.currentWallet = ethers.Wallet.fromMnemonic(phrase);
    return true;
  }

  /**
     * Encrypts the wallet object and saves it to the storage area
     * @param overwrite If true, the wallet object will be saved even if one already exists
     * @param password Password to encrypt the wallet with
     * @returns true if the action succeeded following the overwrite argument
     */
  async saveEncryptedWallet(overwrite: boolean, password: string): Promise<boolean> {
    if (this.currentWallet === null || (!overwrite && (await this.willOverwrite()))) {
      return false;
    }

    // Save the new wallet
    const encryptedWalletJSON = await this.currentWallet.encrypt(password, {
      scrypt: {
        N: 131072 / 4,
      },
    });
    await this.storageArea.set({
      storageVersion,
      currentWallet: encryptedWalletJSON,
    });
    return true;
  }

  /**
   * "Locks" a wallet by clearing the currentWallet variable.
   * @returns true if a wallet was locked, false if no wallet was available to be locked
   */
  lockWallet(): boolean {
    if (this.currentWallet !== null) {
      this.currentWallet = null;
      return true;
    }
    return false;
  }

  /**
   * Deletes the current wallet permanently from memory and local storage.
   * @returns a Promise that resolves when the operation is complete
   */
  async deleteWallet(): Promise<void> {
    await this.storageArea.remove('currentWallet');
    this.currentWallet = null;
    this.encryptedWalletJSON = null;
    this.isStateLoaded = false;
  }
}
