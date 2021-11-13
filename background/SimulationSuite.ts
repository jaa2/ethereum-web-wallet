import { Interface } from '@ethersproject/abi';
import { Provider, TransactionRequest } from '@ethersproject/abstract-provider';
import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import ERC20ABI from '../erc20abi.json';

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

    const code = await this.provider.getCode(t.to as string);
    if ((t.data !== undefined || t.data !== null) && t.data !== '0x' && code === '0x') {
      return true;
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
      const tGasLimt = t.gasLimit as BigNumber;
      if (tGasLimt.gt(estGas)) {
        return false;
      }
    } catch {
      return false;
    }

    return true;
  }

  /**
     * Returns true if the transaction's gas price is not too high or too low
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
  async isGasPriceReasonable(t: TransactionRequest | null): Promise<Boolean> {
    if (t === null) {
      return false;
    }

    const feeData = await this.provider.getFeeData();
    const { type } = t;
    if (type === null) {
      return false;
    }

    if (type === 2) {
      const maxPriorityFeePerGas = t.maxPriorityFeePerGas as BigNumber;
      const maxFeePerGas = t.maxFeePerGas as BigNumber;
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
      // console.log("max priority fee per gas: ", maxPFPG);
      // console.log("est max priority fee per gas: ", estMaxPFPG);
      // console.log("max fee per gas: ", maxFPG);
      // console.log("est max fee per gas: ", estMaxFPG);
      if ((maxPFPG >= estMaxPFPG) && (maxPFPG <= estMaxPFPG * 2)
                && (maxFPG >= estMaxFPG * 1.03) && (maxFPG <= estMaxFPG * 3)) {
        return true;
      }
      return false;
    }
    const tGasPrice = t.gasPrice as BigNumber;
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

    let tGasPrice = t.gasPrice as BigNumber;
    const tGasLimit = t.gasLimit;
    if (tGasLimit === null || tGasLimit === undefined) {
      return false;
    }

    const tMaxFeePerGas = t.maxFeePerGas as BigNumber;
    const tMaxPriorityFeePerGas = t.maxPriorityFeePerGas as BigNumber;
    if (tGasPrice === null || tGasPrice === undefined) {
      if (tMaxFeePerGas !== undefined && tMaxPriorityFeePerGas !== undefined) {
        tGasPrice = (tMaxFeePerGas.add(tMaxPriorityFeePerGas));
      } else {
        return false;
      }
    }

    const tGasTotalFees = tGasPrice.mul(tGasLimit);

    const amount = t.value as BigNumber;
    if (amount.add(tGasTotalFees).gt(balance)) {
      return true;
    }

    return false;
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
