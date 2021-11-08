import { Wallet } from "@ethersproject/wallet";
import { WalletStorage } from "./WalletStorage";

/**
 * The current storage version.
 */
const storageVersion: Number = 1;

/**
 * A class that abstracts loading and handling the user's wallet
 * - Creating a wallet and encrypting it with a password
 * - Local storage of encrypted wallet data
 * - Accessing the wallet object directly
 */
export class WalletState {
    // StorageArea from which state is loaded/saved
    storageArea: WalletStorage;
    // If non-null, a valid wallet object is available
    currentWallet: Wallet|null = null;
    stateObject: JSON|null = null;
    // If true, the encrypted local storage contents have been loaded into memory
    isStateLoaded: boolean = false;
    // Stores the encrypted wallet JSON, if it has been loaded
    encryptedWalletJSON: string|null = null;

    constructor(storageArea: WalletStorage) {
        this.storageArea = storageArea;
    }

    /**
     * @returns true if saving a new wallet would overwrite an existing one
     */
    async willOverwrite(): Promise<boolean> {
        // Try to load wallet data. If there is any, don't proceed with wallet creation
        var hasWalletData = false;
        await this.loadEncrypted()
        .then(() => {
            hasWalletData = true;
        })
        .catch(reason => {
            if (reason != "Not all storage values found") {
                hasWalletData = true;
            }
        });

        return hasWalletData;
    }
    
    /**
     * Get the wallet object for an immediate operation.
     * @returns A wallet object, if it exists
     */
    async getWallet(): Promise<Wallet|null> {
        return this.currentWallet;
    }

    /**
     * Load a saved web wallet
     * @returns A promise that resolves if a wallet was found and loaded, rejecting otherwise
     */
    loadEncrypted(): Promise<void> {
        const _this: WalletState = this;
        if (_this.isStateLoaded) {
            // The state is already loaded
            return Promise.resolve();
        }

        const keysToFind: Array<string> = ["storageVersion", "currentWallet"];
        return new Promise<void>(async function (resolve: any, reject: any) {
            _this.storageArea.get(keysToFind)
            .then(val => {
                const allFound: boolean = keysToFind.map((key: string) => val.hasOwnProperty(key))
                    .reduce((prev: boolean, cur: boolean) => prev && cur);
                if (!allFound) {
                    reject("Not all storage values found");
                    return;
                }
                if (val.storageVersion != storageVersion) {
                    reject("Storage version incompatible");
                    return;
                }
                _this.encryptedWalletJSON = val.currentWallet;
                _this.isStateLoaded = true;
                resolve();
            })
            .catch(reason => {
                reject(reason);
            });
        });
    }

    /**
     * Attempts to decrypt an encrypted wallet. This function will have a noticeable
     * (multi-second) delay because of the extensive compute and memory resources used,
     * which make brute-force cracking more difficult.
     * @param password Password to the wallet
     * @param progressCallback Callback function accepting a number between 0 and 1,
     * the progress of decrypting the wallet.
     */
    async decryptWallet(password: string, progressCallback?: {(progress: Number): any}): Promise<boolean> {
        const _this = this;
        if (_this.encryptedWalletJSON === null) {
            // Load encrypted wallet information if it hasn't already been loaded
            await _this.loadEncrypted();
            if (_this.encryptedWalletJSON === null) {
                return new Promise((_resolve: any, reject: any) => {
                    reject("No stored wallet exists");
                });
            }
        }

        return Wallet.fromEncryptedJson(_this.encryptedWalletJSON, password, progressCallback)
        .then(wallet => {
            // Success!
            _this.currentWallet = wallet;
            return true;
        });
    }

    /**
     * Creates a new random wallet
     * @param overwrite If true, a new wallet will be created even if one already exists
     * @returns true if the action succeeded following the overwrite argument
     */
    async createWallet(overwrite: boolean): Promise<boolean> {
        if (!overwrite && (await this.willOverwrite())) {
            return false;
        }

        // Create the new wallet
        this.currentWallet = Wallet.createRandom();
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
        var encryptedWalletJSON = await this.currentWallet.encrypt(password);
        await this.storageArea.set({
            "storageVersion": storageVersion,
            "currentWallet": encryptedWalletJSON
        });
        return true;
    }
}