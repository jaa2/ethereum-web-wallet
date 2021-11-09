/**
 * An interface for a key-value based storage system
 */
export interface WalletStorage {
  get(keys?: string | string[] | Record<string, any>): Promise<Record<string, any>>;
  set(items: Record<string, any>): Promise<void>;
}
