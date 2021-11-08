import { expect } from 'chai';
import { resolve } from 'dns';
import { WalletState } from '../background/WalletState';
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
});