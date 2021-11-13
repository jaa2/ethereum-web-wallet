import { Provider, TransactionRequest } from '@ethersproject/providers';
import {
  BytesLike, Contract, ethers, Transaction, Wallet,
} from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import SimulationSuite from './SimulationSuite';

class SimulationSendTransactions {
  provider: Provider;

  simulationSuite: SimulationSuite;

  constructor(provider: Provider) {
    this.provider = provider;
    this.simulationSuite = new SimulationSuite(this.provider);
  }

  /**
   * Returns the USD amount of 1 ETH
   */
  async currentETHtoUSD() {
    const abi = ['function latestAnswer() public view returns (int256)'];
    const chainlinkETHUSDFeed = new Contract('0x0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      abi, this.provider);
    const priceInUSD = await chainlinkETHUSDFeed.latestAnswer();
    return priceInUSD;
  }

  // TODO: Cache the result because the numbers don't change until the blockchain has changed
  /**
   * Returns the network's current maxFeePerGas, maxPriorityFeePerGas, and gasPrice
   */
  async currentFees() {
    const feeData = await this.provider.getFeeData();
    return feeData;
  }

  // TODO: come back to later
  // Source:
  // https://ethereum.stackexchange.com/questions/80617/how-can-i-know-a-hash-mined-and-confirmed-by-ethers-js
  /**
   * Returns a boolean if the transaction has been mined or not
   * @param t Transaction
   */
  async isTransactionMined(t: Transaction) {
    const transactionReceipt = await this.provider.getTransactionReceipt(t.hash as string);
    if (transactionReceipt !== null && transactionReceipt.blockNumber !== null) {
      return true;
    }

    return false;
  }

  // TODO: This function should enter the gas limit for a transaction request
  // Need a global version of the TransactionRequest?
  /**
   * Calculates the gas limit in ETH
   * @param t Transaction
   * @returns the gas limit in ETH as a string
   */
  async gasLimitInETH(t: TransactionRequest) {
    let estGas = await this.provider.estimateGas({ to: t.to, value: t.value });
    if (estGas.lte(21000)) {
      estGas = estGas.mul(1.2);
    }

    const gasLimitEth = ethers.utils.formatEther(estGas);
    return gasLimitEth;
  }

  /**
   * Calculates the total transaction fee in ETH
   * @param t Transaction
   * @returns the total transaction fee in ETH as a string
   */
  static totalTransactionFeeInETH(t: Transaction) {
    const tGasLimit = t.gasLimit;
    const { type } = t;
    if (type === null) {
      return null;
    }

    let tGasPrice = BigNumber.from(0);
    if (type === 2) {
      const tMaxFeePerGas = t.maxFeePerGas;
      const tMaxPriorityFeePerGas = t.maxPriorityFeePerGas;
      if (tMaxFeePerGas === undefined || tMaxPriorityFeePerGas === undefined) {
        return null;
      }

      tGasPrice = tMaxFeePerGas.add(tMaxPriorityFeePerGas);
    } else {
      tGasPrice = t.gasPrice as BigNumber;
      if (tGasPrice === undefined) {
        return null;
      }
    }

    const tTotalGasFees = tGasLimit.mul(tGasPrice);
    const tTotal = ethers.utils.formatEther(tTotalGasFees.add(t.value));
    return tTotal;
  }

  /**
   * Simulates a transaction
   * @param to the destination address
   * @param from the user's address
   * @param amount the amount transaction is trying to send
   * @param wallet the user's wallet
   * @returns the list of checks that the transaction passed in the simulation
   */
  async simulateTransaction(to: string, from: string, amount: number,
    data: BytesLike, wallet: Wallet) {
    const t = await wallet.populateTransaction({ to, from, value: amount });
    if (t === null) {
      return null;
    }
    // Our Simulation Checks
    const code = await this.provider.getCode(t.to as string);
    let isEOA = false;
    if (data !== '0x' && code === '0x') {
      isEOA = true;
    }
    let promises;
    if (isEOA) {
      promises = Promise.all([this.simulationSuite.isGasLimitEnough(t),
        this.simulationSuite.isGasPriceReasonable(t),
        SimulationSuite.isAddressValid(t),
        SimulationSuite.isTotalMoreThanWallet(t, await wallet.getBalance()),
        this.simulationSuite.isDataSentToEOA(t)]);
    } else {
      promises = Promise.all([this.simulationSuite.isGasLimitEnough(t),
        this.simulationSuite.isGasPriceReasonable(t),
        SimulationSuite.isAddressValid(t),
        SimulationSuite.isTotalMoreThanWallet(t, await wallet.getBalance()),
        this.simulationSuite.isTokenTransferToContract(t)]);
    }

    const simResults = await promises;
    // Simulation Check = Key; Boolean = Value
    const passedChecks = new Map([
      ['Gas Limit is Reasonable', simResults[0]],
      ['Gas Price is Reasonable', simResults[1]],
      ['Address is Valid', simResults[2]],
      ['Total is more than Wallet', simResults[3]],
      ['Data is sent correctly', simResults[4] === false]]);

    return passedChecks;
  }

  /**
   * Sends a transaction
   * @param t Transaction to send
   * @returns the transaction hash and the promise from sending t
   */
  async sendTransaction(t: Transaction) {
    const tHash = t.hash as string;
    const response = await this.provider.sendTransaction(tHash);
    return { hash: tHash, response };
  }
}
export default SimulationSendTransactions;
