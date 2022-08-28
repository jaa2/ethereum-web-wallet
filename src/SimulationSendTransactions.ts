import { Provider, TransactionRequest } from '@ethersproject/providers';
import {
  Contract, Transaction, Signer,
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
  async currentETHtoUSD(amount: number):Promise<number> {
    const abi = ['function latestAnswer() public view returns (int256)'];
    // Mainnet: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
    // Old Ropsten: 0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507
    // TODO: Find different address to calculate up to date conversion from ETH to USD
    const chainlinkETHUSDFeed = new Contract(
      '0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507',
      abi,
      this.provider,
    );
    try {
      const priceInUSD = (BigNumber.from(await chainlinkETHUSDFeed.latestAnswer()).toNumber()
        / 10 ** 8) * amount;
      return priceInUSD;
    } catch (e) {
      return 0;
    }
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
      return await this.provider.estimateGas(t);
    } catch (e) {
      // TODO: Use some other metric for determining the gas limit
      return BigNumber.from(1000000);
    }
  }

  /**
   * Calculates the total gas fee in ETH
   * @param t Transaction
   * @returns the total gas fee in ETH as a string
   */
  static totalGasFeeInETH(t: TransactionRequest): BigNumber {
    const { type } = t;
    if (type === null) {
      return BigNumber.from(0);
    }

    const tGasLimit = BigNumber.from(t.gasLimit);
    let tGasPrice = BigNumber.from(0);
    if (type === 2) {
      tGasPrice = BigNumber.from(t.maxFeePerGas);
    } else {
      tGasPrice = BigNumber.from(t.gasPrice);
    }
    return tGasLimit.mul(tGasPrice);
  }

  /**
   * Simulates a transaction
   * @param to the destination address
   * @param from the user's address
   * @param amount the amount transaction is trying to send
   * @param wallet the user's wallet
   * @returns the list of checks that the transaction passed in the simulation
   */
  async simulateTransaction(txReq: TransactionRequest, wallet: Signer) {
    try {
      const t = await wallet.populateTransaction(txReq);

      // Our Simulation Checks
      const promises = [
        this.simulationSuite.isGasLimitEnough(t),
        SimulationSuite.canAffordTx(t, await wallet.getBalance()),
      ];
      const checkTexts = ['Gas limit is reasonable', 'Total cost does not exceed balance'];

      if (t.to !== undefined) {
        const code = await this.provider.getCode(String(t.to));
        let isEOA = false;
        if (code === '0x') {
          isEOA = true;
        }

        if (isEOA) {
          promises.push(this.simulationSuite.isDataSentToEOA(t).then((res) => !res));
          checkTexts.push('Data is not sent to non-contract address');
        } else {
          promises.push(this.simulationSuite.isTokenTransferToContract(t).then((res) => !res));
          checkTexts.push('ERC-20 token is not sent to contract address');
        }
      }

      const simResults = await Promise.all(promises);
      // Simulation Check = Key; Boolean = Value
      const simulationChecks = new Map(checkTexts.map((text, i) => [` ${text}`, simResults[i]]));

      return { simulationChecks, t };
    } catch (e) {
      throw new Error(e as string);
    }
  }
}
export default SimulationSendTransactions;
