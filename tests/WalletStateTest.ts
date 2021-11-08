import { Wallet } from '@ethersproject/wallet';
import { expect } from 'chai';
import { resolve } from 'dns';
import { WalletState } from '../background/WalletState';
import { WalletStorage } from '../background/WalletStorage';
import { MemoryStorage } from './storage/MemoryStorage';

describe("WalletState tests", () => {
    it("loadEncrypted rejects if nothing exists in local storage", async () => {
        var state: WalletState = new WalletState(new MemoryStorage());
        var didReject: boolean = await state.loadEncrypted()
            .then(() => {
                return false;
            })
            .catch(reason => {
                expect(reason).to.be.equal("Not all storage values found");
                return true;
            });
        expect(didReject).to.be.true;
    });

    it("Creates, saves, and loads a wallet", async () => {
        var storage: WalletStorage = new MemoryStorage();
        var state1: WalletState = new WalletState(storage);
        await state1.createWallet(false);
        var walletAddress: string = ((await state1.getWallet()) as Wallet).address;

        const password: string = "examplePassword2021!";
        await state1.saveEncryptedWallet(false, password);

        var state2: WalletState = new WalletState(storage);
        await state2.loadEncrypted();
        await state2.decryptWallet(password);
        expect(((await state2.getWallet()) as Wallet).address == walletAddress);
    });
});