import { WalletStorage } from '../../background/WalletStorage';

/**
 * A class that implements a WalletStorage container in memory for testing
 */
export default class MemoryStorage implements WalletStorage {
  storage: Record<string, any> = {};

  get(keys?: string | string[] | Record<string, any>): Promise<Record<string, any>> {
    if (typeof (keys) === 'string') {
      if (Object.keys(this.storage).includes(keys)) {
        return Promise.resolve({
          // Use computed property name so that it's not "keys"
          [keys]: this.storage[keys],
        });
      }
      // Not found
      return Promise.resolve({});
    } if (keys instanceof Array) {
      // Merge each result into a single Object
      return Promise.all(keys.map((val) => this.get(val)))
        .then((vals) => vals.reduce((prev, cur) => Object.assign(prev, cur)));
    } if (typeof (keys) === 'object') {
      // Merge each result into the keys object
      const result: Record<string, any> = keys;
      const keysToFind: Array<string> = Object.keys(result);
      return Promise.all(keysToFind.map((val) => this.get(val)))
        .then((vals) => vals.reduce((prev, cur) => Object.assign(prev, cur), keys));
    }
    // Unknown key
    return Promise.resolve({});
  }

  set(items: Record<string, any>): Promise<void> {
    const keys: Array<string> = Object.keys(items);
    for (let i = 0; i < keys.length; i += 1) {
      this.storage[keys[i]] = items[keys[i]];
    }
    return Promise.resolve();
  }
}
