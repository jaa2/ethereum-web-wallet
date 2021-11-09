import { expect } from 'chai';
import { Provider, EtherscanProvider } from '@ethersproject/providers';
import { Transaction, BigNumber } from 'ethers';
import { parseEther } from '@ethersproject/units';
import { SimulationSuite } from '../background/SimulationSuite';

// Source: https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
// Used to create delays
describe('SimulationResults tests', () => {
  let sr: SimulationSuite;
  let provider: Provider;

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  before(async () => {
    // TODO: Put API key in environment variable/config file instead
    provider = new EtherscanProvider('ropsten', 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');
    sr = new SimulationSuite(provider);
  });

  // TODO: Fix Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves
  // All tests do pass when there is no timeout error
  it('Can detect direct ERC-20 token transfers to smart contracts', async () => {
    // Token transfer to contract address
    let t: Transaction = await provider.getTransaction('0x04cb2b86afadc05ee00af7b9f5d58c676372ac7549bcfebc0c07012df4fe8690');
    expect(await sr.isTokenTransferToContract(t))
      .to.be.true;

    await delay(1000);
    // Call to contract address; not a token transfer
    t = await provider.getTransaction('0x26c10475f0e6a73b45ee73f54743c459f428efa899d0a4c6ec72d65dc23380f1');
    expect(await sr.isTokenTransferToContract(t))
      .to.be.false;

    await delay(1000);

    // Token transfer to non-contract address
    t = await provider.getTransaction('0x8431016caad2a1bed1d4a7b4e6b2c9d6c797ee6f3f775c694cace3ddc7d12e98');
    expect(await sr.isTokenTransferToContract(t))
      .to.be.false;
  });

  it('Can detect data sent to non-contract addresses', async () => {
    // Data sent to non-contract address
    let t: Transaction = await provider.getTransaction('0xeb0d50c3d14cfce8f84ae86ac4cde37d4913c6d6b331bf9a61197c3e1f0f27e5');
    expect(await sr.isDataSentToEOA(t))
      .to.be.true;

    await delay(1000);

    // Data sent to contract address
    t = await provider.getTransaction('0xbb13c1de1d4dd0aea8fc9e5ea22f4362c76d9a24d6ef7706e23eaae529820f70');
    expect(await sr.isDataSentToEOA(t))
      .to.be.false;

    await delay(1000);

    // No data sent
    t = await provider.getTransaction('0x26c10475f0e6a73b45ee73f54743c459f428efa899d0a4c6ec72d65dc23380f1');
    expect(await sr.isDataSentToEOA(t))
      .to.be.false;
  });

  it('Can determine that the gas limit is enough', async () => {
    // Transaction's gas limit is reasonable
    let t: Transaction = await provider.getTransaction('0xc0f9db74a248ef15b041b576878375213037bc83767ce22b3ae20972c032afcc');
    expect(await sr.isGasLimitEnough(t)).to.be.true;

    await delay(1000);
    // Transaction's gas limit is too low
    // var t: Transaction = await provider.getTransaction("");
    // expect(await sr.isGasLimitEnough(t)).to.be.false;

    // await delay(1000);
    // Transaction's gas limit is too high
    t = await provider.getTransaction('0xc7ed0d3e0190ba51c3d3f0169f5db1117cac355029a9eee8c1387669ed9dc636');
    expect(await sr.isGasLimitEnough(t)).to.be.false;
  });

  it('Can determine that the gas price is reasonable', async () => {
    // Transaction's gas price is reasonable
    const t: Transaction = await provider.getTransaction('0x6a44268d33924f4f36223013d17da57ff98325bf246152214c044c055da4cbf5');
    expect(await sr.isGasPriceReasonable(t)).to.be.true;
    await delay(1000);

    // // Transaction's gas price is too high
    // var t: Transaction = await provider.getTransaction("");
    // expect(await sr.isGasPriceReasonable(t)).to.be.false;

    // // Transaction's gas price is too low
    // var t: Transaction = await provider.getTransaction("");
    // expect(await sr.isGasPriceReasonable(t)).to.be.false;
  });

  // it("Can detect empty data fields", async () => {
  //     // Transaction's _____ data field is empty
  //     var t: Transaction = await provider.getTransaction("");
  //     expect(await sr.hasEmptyDataFields(t)).to.be.true;

  //     // Transaction has no empty data fields
  //     var t: Transaction = await provider.getTransaction("");
  //     expect(await sr.hasEmptyDataFields(t)).to.be.false;
  // });

  it("Can detect that the transaction's destination address is a valid address", async () => {
    // Transaction is sent to a valid address
    let t: Transaction = await provider.getTransaction('0xaa527abc67d4e64b97194502f6ffd5908b4b389bb4098a1aa4b239105968dc9d');
    expect(await sr.isAddressValid(t)).to.be.true;
    await delay(1000);

    // Transaction is sent to an invalid address
    t = await provider.getTransaction('0xaa527abc67d4e64b97144502f6ffd5908b4b389bb4098a1aa4b239105968dc9d');
    expect(await sr.isAddressValid(t)).to.be.false;
  });

  // it("Can detect that a transaction is being sent to a new address", async () => {
  //     // Transaction is being sent to a new address
  //     var t: Transaction = await provider.getTransaction("");
  //     expect(await sr.isNewAddress(t)).to.be.true;

  //     // Transaction is not being sent to a new address
  //     var t: Transaction = await provider.getTransaction("");
  //     expect(await sr.isNewAddress(t)).to.be.false;
  // });

  it('Can detect that the total amount of the transaction is more than what exists in the wallet', async () => {
    let balance = parseEther('0.005');
    // Transaction costs more than what user has in wallet
    let t: Transaction = await provider.getTransaction('0x6a44268d33924f4f36223013d17da57ff98325bf246152214c044c055da4cbf5');
    expect(await sr.isTotalMoreThanWallet(t, balance)).to.be.true;
    await delay(1000);

    // Transaction amount is within the wallet's capacity
    balance = parseEther('0.05');
    t = await provider.getTransaction('0x6a44268d33924f4f36223013d17da57ff98325bf246152214c044c055da4cbf5');
    expect(await sr.isTotalMoreThanWallet(t, balance)).to.be.false;
  });
});
