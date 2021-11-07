import { expect } from 'chai';
import { SimulationSuite } from "../background/SimulationSuite"
import { Provider, EtherscanProvider } from "@ethersproject/providers"
import { Transaction } from 'ethers';

describe("SimulationResults tests", () => {
    var sr: SimulationSuite;
    var provider: Provider;

    before(async () => {
        // TODO: Put API key in environment variable/config file instead
        provider = new EtherscanProvider("ropsten", "AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68");
        sr = new SimulationSuite(provider);
    });

    // TODO: Fix Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves
        // All tests do pass when there is no timeout error
    it("Can detect direct ERC-20 token transfers to smart contracts", async () => {
        // Token transfer to contract address
        var t: Transaction = await provider.getTransaction("0x04cb2b86afadc05ee00af7b9f5d58c676372ac7549bcfebc0c07012df4fe8690");
        expect(await sr.isTokenTransferToContract(t))
            .to.be.true;
            
        // Call to contract address; not a token transfer
        t = await provider.getTransaction("0x26c10475f0e6a73b45ee73f54743c459f428efa899d0a4c6ec72d65dc23380f1");
        expect(await sr.isTokenTransferToContract(t))
            .to.be.false;

        // Token transfer to non-contract address
        // TODO: Check to make sure that there is not a contract associated with this addresss
            // Against implementation and running provider.getCode(), there is some contract associated with this address
        t = await provider.getTransaction("0x8431016caad2a1bed1d4a7b4e6b2c9d6c797ee6f3f775c694cace3ddc7d12e98");
        expect(await sr.isTokenTransferToContract(t))
            .to.be.false;
    });

    it("Can detect data sent to non-contract addresses", async () => {
        // Data sent to non-contract address
        var t: Transaction = await provider.getTransaction("0xeb0d50c3d14cfce8f84ae86ac4cde37d4913c6d6b331bf9a61197c3e1f0f27e5");
        expect(await sr.isDataSentToEOA(t))
            .to.be.true;
        // Data sent to contract address
        t = await provider.getTransaction("0xbb13c1de1d4dd0aea8fc9e5ea22f4362c76d9a24d6ef7706e23eaae529820f70");
        expect(await sr.isDataSentToEOA(t))
            .to.be.false;
        // No data sent
        t = await provider.getTransaction("0x26c10475f0e6a73b45ee73f54743c459f428efa899d0a4c6ec72d65dc23380f1");
        expect(await sr.isDataSentToEOA(t))
            .to.be.false;
    });

    // it("Can determine that the gas price is reasonable", async () => {
    //     // Transaction's gas price is reasonable
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isGasPriceReasonable(t)).to.be.true;

    //     // Transaction's gas price is too high
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isGasPriceReasonable(t)).to.be.false;

    //     // Transaction's gas price is too low
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isGasPriceReasonable(t)).to.be.false;
    // });

    // it("Can detect empty data fields", async () => {
    //     // Transaction has an _____ data field
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.hasEmptyDataFields(t)).to.be.true;

    //     // Transaction has no empty data fields
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.hasEmptyDataFields(t)).to.be.false;
    // });

    // it("Can detect that the transaction is being sent on the right network", async () => {
    //     // Transaction is sent on the right network
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isOnRightNetwork(t)).to.be.true;

    //     // Transaction is sent on the wrong network
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isOnRightNetwork(t)).to.be.false;
    // });

    // it("Can detect that a transaction is being sent to a new address", async () => {
    //     // Transaction is being sent to a new address
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isNewAddress(t)).to.be.true;

    //     // Transaction is not being sent to a new address
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isNewAddress(t)).to.be.false;
    // });

    // it("Can detect that the total amount of the transaction is more than what exists in the wallet", async () => {
    //     // Transaction costs more than what user has in wallet
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isTotalMoreThanWallet(t)).to.be.true;

    //     // Transaction amount is within the wallet's capacity
    //     var t: Transaction = await provider.getTransaction("");
    //     expect(await sr.isTotalMoreThanWallet(t)).to.be.false;
    // });
});