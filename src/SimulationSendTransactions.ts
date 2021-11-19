import { Provider, TransactionRequest } from '@ethersproject/providers';
import {
  ethers, Transaction, Wallet,
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
    try {
      const transactionReceipt = await this.provider.getTransactionReceipt(String(t.hash));
      if (transactionReceipt !== null && transactionReceipt.blockNumber !== null) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  // TODO: This function should enter the gas limit for a transaction request
  // Need a global version of the TransactionRequest?
  /**
   * Calculates the gas limit for a transaction request object
   * @param t Transaction
   * @returns the gas limit in ETH as a string
   */
  async getGasLimit(t: TransactionRequest) {
    try {
      let estGas = await this.provider.estimateGas(t);
      if (estGas.gte(BigNumber.from(21000))) {
        estGas = BigNumber.from(estGas.toNumber() * 1.2);
      }

      return estGas;
    } catch {
      return BigNumber.from(0);
    }
  }

  // source:
  // https://ethereum.stackexchange.com/questions/84004/ethers-formatetherwei-with-max-4-decimal-places/97885
  /**
   * Calculates the total gas fee in ETH
   * @param t Transaction
   * @returns the total gas fee in ETH as a string
   */
  static totalGasFeeInETH(t: TransactionRequest) {
    const tGasLimit = BigNumber.from(t.gasLimit);
    const { type } = t;
    if (type === null) {
      return null;
    }

    let tGasPrice = BigNumber.from(0);
    if (type === 2) {
      const tMaxFeePerGas = BigNumber.from(t.maxFeePerGas);
      const tMaxPriorityFeePerGas = BigNumber.from(t.maxPriorityFeePerGas);

      tGasPrice = tMaxFeePerGas.add(tMaxPriorityFeePerGas);
    } else {
      tGasPrice = BigNumber.from(t.gasPrice);
    }

    let tTotalGasFees = ethers.utils.formatEther(tGasLimit.mul(tGasPrice));
    tTotalGasFees = String(Math.round((+tTotalGasFees) * 10 ** 5) / 10 ** 5);
    return tTotalGasFees;
  }

  // Source:
  // https://ethereum.stackexchange.com/questions/84004/ethers-formatetherwei-with-max-4-decimal-places/97885
  /**
   * Calculates the total transaction fee in ETH
   * @param t Transaction
   * @returns the total transaction fee in ETH as a string
   */
  static totalTransactionFeeInETH(t: TransactionRequest) {
    const tGasLimit = BigNumber.from(t.gasLimit);
    const { type } = t;
    if (type === null) {
      return null;
    }

    let tGasPrice = BigNumber.from(0);
    if (type === 2) {
      const tMaxFeePerGas = BigNumber.from(t.maxFeePerGas);
      const tMaxPriorityFeePerGas = BigNumber.from(t.maxPriorityFeePerGas);

      tGasPrice = tMaxFeePerGas.add(tMaxPriorityFeePerGas);
    } else {
      tGasPrice = BigNumber.from(t.gasPrice);
    }

    const tTotalGasFees = tGasLimit.mul(tGasPrice);
    let tTotal = ethers.utils.formatEther(tTotalGasFees.add(BigNumber.from(t.value)));
    tTotal = String(Math.round((+tTotal) * 10 ** 5) / 10 ** 5);
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
  async simulateTransaction(txReq: TransactionRequest, wallet: Wallet) {
    try {
      const t = await wallet.populateTransaction(txReq);

      // Our Simulation Checks
      const code = await this.provider.getCode(String(t.to));
      let isEOA = false;
      if (code === '0x') {
        isEOA = true;
      }
      let promises;
      if (isEOA) {
        promises = Promise.all([this.simulationSuite.isGasLimitEnough(t),
          SimulationSuite.isGasPriceReasonable(t, await this.provider.getFeeData()),
          SimulationSuite.isTotalMoreThanWallet(t, await wallet.getBalance()),
          this.simulationSuite.isDataSentToEOA(t)]);
      } else {
        promises = Promise.all([this.simulationSuite.isGasLimitEnough(t),
          SimulationSuite.isGasPriceReasonable(t, await this.provider.getFeeData()),
          SimulationSuite.isTotalMoreThanWallet(t, await wallet.getBalance()),
          this.simulationSuite.isTokenTransferToContract(t)]);
      }

      const simResults = await promises;
      // Simulation Check = Key; Boolean = Value
      const simulationChecks = new Map([
        ['Gas Limit is Reasonable', simResults[0]],
        ['Gas Price is Reasonable', simResults[1]],
        ['Address is Valid', true],
        ['Total Fee is not More than Wallet', simResults[2] === false],
        ['Data is Sent Correctly', simResults[3] === false]]);

      return { simulationChecks, t };
    } catch (e) {
      throw new Error(e as string);
    }
  }

  /**
   * Sends a transaction
   * @param t Transaction to send
   * @returns the transaction hash and the promise from sending t
   */
  async sendTransaction(t: Transaction) {
    const tHash = String(t.hash);
    const response = await this.provider.sendTransaction(tHash);
    return { hash: tHash, response };
  }
}
export default SimulationSendTransactions;
