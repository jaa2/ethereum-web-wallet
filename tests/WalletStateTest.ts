import { Wallet } from '@ethersproject/wallet';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import WalletState from '../background/WalletState';
import { WalletStorage } from '../background/WalletStorage';
import MemoryStorage from './storage/MemoryStorage';

// Load chai-as-promised support
chai.use(chaiAsPromised);

describe('WalletState tests', () => {
  it('loadEncrypted rejects if nothing exists in local storage', async () => {
    const state: WalletState = new WalletState(new MemoryStorage());
    expect(state.loadEncrypted()).to.eventually.be.rejectedWith('Not all storage values found');
  });

  it('Creates, saves, and loads a wallet', async () => {
    const storage: WalletStorage = new MemoryStorage();
    // Create
    const state1: WalletState = new WalletState(storage);
    await state1.createWallet(false, null);
    const key: string = ((await state1.getWallet()) as Wallet).privateKey;
    // Encrypt and save
    const password: string = 'examplePassword2021!';
    await state1.saveEncryptedWallet(false, password);
    // Load and decrypt
    const state2: WalletState = new WalletState(storage);
    await state2.loadEncrypted();
    await state2.decryptWallet(password);
    expect(((await state2.getWallet()) as Wallet).privateKey === key);
  });
});
