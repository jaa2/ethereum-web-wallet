import { WalletStorage } from "../../background/WalletStorage";

/**
 * A class that implements a WalletStorage container in memory for testing
 */
export class MemoryStorage implements WalletStorage {
    storage: Record<string, any> = {};

    get(keys?: string | string[] | Record<string, any>): Promise<Record<string, any>> {
        const _this = this;
        return new Promise(async (resolve: any, reject: any) => {
            if (typeof(keys) === "string") {
                if (_this.storage.hasOwnProperty(keys)) {
                    resolve({
                        // Use computed property name so that it's not "keys"
                        [keys]: _this.storage[keys]
                    });
                    return;
                } else {
                    // Not found
                    resolve({});
                    return;
                }
            } else if (keys instanceof Array) {
                // Merge each result into a single Object
                var result: Record<string, any> = {};
                for (let val of keys) {
                    result = Object.assign(result, await _this.get(val));
                }
                resolve(result);
            } else if (typeof(keys) == "object") {
                // Merge each result into the keys object
                var keysToFind: Array<string> = Object.keys(keys);
                for (let val of keysToFind) {
                    keys = Object.assign(keys, await _this.get(val));
                }
                resolve(keys);
            }
        });
    }

    set(items: Record<string, any>): Promise<void> {
        var keys: Array<string> = Object.keys(items);
        for (let val of keys) {
            this.storage[val] = items[val];
        }
        return Promise.resolve();
    }
    
}