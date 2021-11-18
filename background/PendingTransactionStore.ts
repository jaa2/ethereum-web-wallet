import { Provider, TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import browser from 'webextension-polyfill';
import { storageVersion, WalletStorage } from './WalletStorage';

export default class PendingTransactionStore {
  /**
   * Array of transactions that have not yet been mined
   */
  pendingTransactions: Array<TransactionResponse> = [];

  storageArea: WalletStorage;

  constructor(storageArea: WalletStorage) {
    this.storageArea = storageArea;
  }

  /**
   * Add a pending transaction to the pending transaction list
   * @param txResponse Transaction response or transaction hash to watch for
   * @param isNew If true, saves the entire list of transaction responses
   * @param provider Provider to use, which should be defined if txResponseOrHash is a transaction
   *  hash
   * @returns a promise that resolves if the transaction was successfully added
   */
  async addPendingTransaction(txResponseOrHash: TransactionResponse | string, isNew?: boolean,
    provider?: Provider):
    Promise<void> {
    let txResponse: TransactionResponse;
    // Get transaction from hash
    if (typeof (txResponseOrHash) === 'string') {
      if (provider === undefined) {
        return Promise.reject(new Error('Adding pending transaction hash without provider'));
      }
      txResponse = await provider.getTransaction(txResponseOrHash);
    } else {
      txResponse = txResponseOrHash;
    }

    // Handle TransactionResponse
    if (txResponse.blockNumber !== null && !isNew) {
      return Promise.reject(new Error('Transaction already included in a block'));
    }
    this.pendingTransactions.push(txResponse);
    this.watchForPendingTransaction(txResponse);

    if (isNew) {
      return this.save();
    }
    return Promise.resolve();
  }

  /**
   * Watches a pending transaction and, once it gets included, creates a browser notification
   * and removes the transaction from the pending transactions list
   * @param txResponse TransactionResponse object
   * @returns TransactionReceipt of included transaction
   */
  async watchForPendingTransaction(txResponse: TransactionResponse): Promise<TransactionReceipt> {
    return txResponse.wait(1).then((receipt: TransactionReceipt) => {
    // Remove from pending transactions list
      for (let i = 0; i < this.pendingTransactions.length; i += 1) {
        if (this.pendingTransactions[i].hash === txResponse.hash) {
          this.pendingTransactions.splice(i, 1);
        }
      }
      this.save();
      browser.notifications.create(undefined, {
        type: 'basic',
        title: `Transaction ${receipt.status === 1 ? 'Confirmed' : 'Rejected'}`,
        message: `Transaction ${txResponse.nonce.toString()} ${receipt.status === 1 ? 'Confirmed!' : 'Rejected!'}`,
        iconUrl: 'ww-1024.png',
      });
      return receipt;
    });
  }

  /**
     * Loads pending transaction hashes from local storage
     * @returns true if transaction hashes were found
     */
  async load(provider: Provider): Promise<void> {
    const keysToFind: Array<string> = ['storageVersion', 'pendingTransactions'];
    return this.storageArea.get(keysToFind)
      .then((val: Record<string, any>) => {
        const allFound: boolean = keysToFind.map((key: string) => Object.keys(val).includes(key))
          .reduce((prev: boolean, cur: boolean) => prev && cur);
        if (!allFound) {
          return Promise.reject(new Error('Not all pending transaction storage values found'));
        }
        if (val.storageVersion !== storageVersion) {
          return Promise.reject(new Error('Storage version incompatible'));
        }

        const pendingTxHashes: Array<string> = val.pendingTransactions;
        return pendingTxHashes;
      })
      .then((pendingTxHashes: string[]) => {
        // Get all TransactionResponse objects that do not reject
        const txPromises = pendingTxHashes.map((txhash: string) => provider.getTransaction(txhash));
        return Promise.allSettled(txPromises)
          .then((settledResult: PromiseSettledResult<TransactionResponse>[]) => {
            const txsAny = settledResult.filter((result) => result.status === 'fulfilled');
            const txsFulfilled = txsAny as PromiseFulfilledResult<TransactionResponse>[];
            return txsFulfilled.map((promiseResult) => promiseResult.value);
          });
      })
      .then((txResponses: TransactionResponse[]) => {
        // Only save transactions that haven't been mined yet
        const pendingTxResponses = txResponses.filter(
          (txResponse: TransactionResponse) => txResponse.blockNumber === null,
        );
        for (let i = 0; i < pendingTxResponses.length; i += 1) {
          this.addPendingTransaction(pendingTxResponses[i]);
          console.log(pendingTxResponses[i]); // eslint-disable-line
        }
      })
      .catch((reason) => Promise.reject(reason));
  }

  /**
   * Saves the list of current pending transactions to local storage, overwriting a saved pending
   * transaction list if it exists.
   * @returns a Promise indicating when the operation is complete
   */
  async save(): Promise<void> {
    const pendingTxHashes: string[] = this.pendingTransactions.map(
      (txResponse: TransactionResponse) => txResponse.hash,
    );
    return this.storageArea.set({
      pendingTransactions: pendingTxHashes,
    });
  }
}
