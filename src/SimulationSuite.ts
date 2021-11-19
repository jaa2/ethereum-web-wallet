import { Interface } from '@ethersproject/abi';
import { FeeData, Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import ERC20ABI from './erc20abi.json';

// Source: https://ethereum.stackexchange.com/questions/11144/how-to-decode-input-data-from-a-transaction
// To decode transaction data

class SimulationSuite {
  provider: Provider;

  erc20interface: Interface;

  /**
     * SimulationSuite constructor
     * @param provider Provider to make calls with
     */
  constructor(provider: Provider) {
    this.provider = provider;
    this.erc20interface = new Interface(ERC20ABI);
  }

  /**
     * Returns whether a transaction is a token transfer to a contract address
     * See https://github.com/ethers-io/ethers.js/issues/423 for decoding tx data
     * See https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#methods
     *  for the ERC-20 ABI
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
  async isTokenTransferToContract(t: TransactionRequest | null): Promise<Boolean> {
    if (t === null) {
      return false;
    }
    // If destination address is not a contract address, return false
    /** Using getCode() to determine if a contract is associated with the address
         *  Source: https://ethereum.stackexchange.com/questions/83017/how-do-you-know-if-a-contract-is-destroyed
         *  Source: https://docs.ethers.io/v5/api/providers/provider/
        */
    // Checking if transaction is a token transfer and
    // then checking if the destination address is a contract address
    let res = true;
    try {
      const input = await this.erc20interface.parseTransaction({ data: t.data as string });
      const dest = input.args[0];
      const code = await this.provider.getCode(dest);
      if (code === '0x') {
        res = false;
      }
    } catch {
      res = false;
    }

    return res;
  }

  /**
     * Returns whether a transaction has data but is sent to an EOA (non-contract)
     * address
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
  async isDataSentToEOA(t: TransactionRequest | null): Promise<Boolean> {
    if (t == null) {
      return false;
    }

    const dest = t.to as string;
    if (dest === null || dest === undefined) {
      return false;
    }

    try {
      const code = await this.provider.getCode(t.to as string);
      if ((t.data !== undefined || t.data !== null) && t.data !== '0x' && code === '0x') {
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }

  /**
     * Returns true if the transaction's gas limit is at least the estimated gas limit
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
  async isGasLimitEnough(t: TransactionRequest | null): Promise<Boolean> {
    if (t === null) {
      return false;
    }

    // Source:
    // https://ethereum.stackexchange.com/questions/109990/how-to-determine-if-a-pending-transaction-will-revert
    try {
      const estGas = await this.provider.estimateGas({ to: t.to, data: t.data, value: t.value });
      const tGasLimit = BigNumber.from(t.gasLimit);
      if (tGasLimit.gte(estGas)) {
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }

  /**
     * Returns true if the transaction's gas price is not too high or too low
     * @param t Transaction to test
     * @param feeData Time-relevant fee data
     * @returns true if the transaction matches the function description
     */
  static async isGasPriceReasonable(t: TransactionRequest | null, feeData: FeeData):
  Promise<Boolean> {
    if (t === null) {
      return false;
    }

    const { type } = t;
    if (type === null) {
      return false;
    }

    try {
      if (type === 2) {
        const maxPriorityFeePerGas = BigNumber.from(t.maxPriorityFeePerGas);
        const maxFeePerGas = BigNumber.from(t.maxFeePerGas);
        if (maxFeePerGas === undefined || maxPriorityFeePerGas === undefined) {
          return false;
        }
        const estMaxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
        const estMaxFeePerGas = feeData.maxFeePerGas;
        if (estMaxPriorityFeePerGas === null || estMaxFeePerGas === null) {
          return false;
        }
        const maxPFPG = maxPriorityFeePerGas.toNumber();
        const estMaxPFPG = estMaxPriorityFeePerGas.toNumber();
        const maxFPG = maxFeePerGas.toNumber();
        const estMaxFPG = estMaxFeePerGas.toNumber();
        if ((maxPFPG >= estMaxPFPG) && (maxPFPG <= estMaxPFPG * 2)
                  && (maxFPG >= estMaxFPG) && (maxFPG <= estMaxFPG * 3)) {
          return true;
        }
        return false;
      }
      const tGasPrice = BigNumber.from(t.gasPrice);
      const estGasPrice = feeData.gasPrice;
      if (tGasPrice === undefined || estGasPrice === null) {
        return false;
      }
      const estGasPrice50 = estGasPrice.toNumber() * 0.5;
      if (estGasPrice.toNumber() - estGasPrice50 >= tGasPrice.toNumber()
          || estGasPrice.toNumber() + estGasPrice50 <= tGasPrice.toNumber()) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  // NOTE: All networks have different address spaces but of the same capacity
  /**
     * Returns true if the destination address is valid
     * @param t Transaction to test
     * @returns true if the transcation matches the function description
     */
  static async isAddressValid(t: TransactionRequest | null): Promise<Boolean> {
    if (t === null) {
      return false;
    }

    try {
      // Returns the checksum address, or we can just the simple isAddress()
      getAddress(t.to as string);
      // Can do additional address checks if needed
    } catch {
      return false;
    }

    return true;
  }

  // TODO: Need address book or list of recent addresses to complete this
  /**
     * Returns true if the transaction is sent to an address it has not been sent to before
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
  //   async isNewAddress(t: Transaction): Promise<Boolean> {
  //       return false;
  //     }
  // NOTE: Need to get wallet balance without using
  // await this.provider.getBalance(await w.getAddress()) for every simulation call
  /**
     * Returns true if the total amount of the transaction is more than what is in the user's wallet
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
  static async isTotalMoreThanWallet(t: TransactionRequest
  | null, balance: BigNumber): Promise<Boolean> {
    if (t === null) {
      return true;
    }

    try {
      let tGasPrice = BigNumber.from(0);
      const tGasLimit = BigNumber.from(t.gasLimit);
      const { type } = t;

      if (type === 2) {
        const tMaxFeePerGas = BigNumber.from(t.maxFeePerGas);
        const tMaxPriorityFeePerGas = BigNumber.from(t.maxPriorityFeePerGas);
        if (tMaxFeePerGas === undefined || tMaxPriorityFeePerGas === undefined) {
          return true;
        }

        tGasPrice = tMaxFeePerGas.add(tMaxPriorityFeePerGas);
      } else {
        tGasPrice = BigNumber.from(t.gasPrice);
        if (tGasPrice === undefined) {
          return true;
        }
      }

      const tTotalGasFees = tGasLimit.mul(tGasPrice);
      const amount = BigNumber.from(t.value);
      if (amount.add(tTotalGasFees).gt(balance)) {
        return true;
      }

      return false;
    } catch {
      return true;
    }
  }

  /**
     * Other Tests to make:
     *
     * Other outrageous parameter magnitudes
     * Will the transaction revert (runs out of gas) if it were included in the next block?
     * Could user's priority fee be safely lowered?
     */
}
export default SimulationSuite;
