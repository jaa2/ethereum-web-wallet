/* eslint-disable @typescript-eslint/no-unused-expressions */

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

  it('Creates, saves, loads, and deletes a wallet', async () => {
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

    // Delete
    await state2.deleteWallet();
    expect((await state2.getWallet()) === null);
    expect(state2.encryptedWalletJSON === null);
    expect(state2.isStateLoaded === false);

    // Ensure that it no longer resides in local storage
    const state3: WalletState = new WalletState(storage);
    expect(state3.loadEncrypted()).to.eventually.be.rejectedWith('Not all storage values found');
  });

  it('Clears the wallet when lockWallet is called', async () => {
    const storage: WalletStorage = new MemoryStorage();
    // Create
    const state1: WalletState = new WalletState(storage);
    await state1.createWallet(false, null);
    expect(await state1.getWallet()).to.be.not.null;
    // Save and lock the wallet
    expect(await state1.saveEncryptedWallet(false, 'password'), 'Save wallet').to.be.true;
    expect(state1.lockWallet()).to.be.true;
    // Verify that wallet now is null
    expect(await state1.getWallet()).to.be.null;
    await state1.loadEncrypted();
    expect(state1.isStateLoaded, 'Wallet state is loaded').to.be.true;
    expect(await state1.getWallet()).to.be.null;
  });
});
