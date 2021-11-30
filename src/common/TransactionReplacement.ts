import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from 'ethers';

/**
 * Minimum price bump, as a percentage, for an updated transaction to be relayed
 */
const priceBump = 13;

/* eslint-disable no-param-reassign */
/**
 * Updates a transaction request so that its fees are high enough to be propagated by the default
 * configuration of geth
 * @param oldTx Transaction currently broadcast to the mempool
 * @param newTx Transaction whose fee properties will be updated
 * @returns newTx with updated fee properties (Note: the original object is modified)
 */
export function setFeeForReplacement(oldTx: TransactionResponse, newTx: TransactionRequest):
TransactionRequest {
  if (!newTx.gasLimit) {
    throw new Error('New transaction\'s gas limit must be defined.');
  }
  if (!oldTx.type) {
    throw new Error('Old TransactionRequest has unknown type and cannot be updated.');
  }
  if (!newTx.type) {
    // Use a type-2 transaction here
    newTx.type = 2;
  }

  let oldMaxFee: BigNumber;
  let oldMaxPriorityFee: BigNumber;

  // We don't check for type-1 transactions (see EIP-3709)
  switch (oldTx.type) {
    case 0:
      // Legacy transactions use gasPrice
      if (!oldTx.gasPrice) {
        throw new Error("Old transaction's gas price not set.");
      }

      // The max fee and max priority fee are both given by the gasPrice field
      oldMaxFee = BigNumber.from(oldTx.gasPrice);
      oldMaxPriorityFee = BigNumber.from(oldTx.gasPrice);
      break;
    case 2:
      // Type-2 transactions define a max fee and max priority fee
      if (!oldTx.maxFeePerGas || !oldTx.maxPriorityFeePerGas) {
        throw new Error("Old transaction's max fee per gas and max priority fee per gas"
                    + ' are not both set.');
      }

      oldMaxFee = BigNumber.from(oldTx.maxFeePerGas);
      oldMaxPriorityFee = BigNumber.from(oldTx.maxPriorityFeePerGas);
      break;
    default:
      throw new Error(`Unknown old transaction type ${oldTx.type}. New fee could not be determined.`);
  }

  // Add 10% to each fee type
  const newMaxFee = oldMaxFee.mul(100 + priceBump).div(100);
  const newMaxPriorityFee = oldMaxPriorityFee.mul(100 + priceBump).div(100);

  // Assign fee based on new transaction's type
  switch (newTx.type) {
    case 0:
      newTx.gasPrice = newMaxFee;
      break;
    case 2:
      newTx.maxFeePerGas = newMaxFee;
      newTx.maxPriorityFeePerGas = newMaxPriorityFee;
      break;
    default:
      throw new Error(`Unknown transaction type ${newTx.type.toString()}. Could not assign new fee.`);
  }

  return newTx;
}
/* eslint-enable no-param-reassign */

/**
 * Generates a zero-value self-transfer transaction with a sufficient max fee to replace a
 * different transaction with the same nonce in the mempool
 * TODO: This function should return a transaction with a gas price that is at least as high
 * as the current network gas price.
 * @param oldTx Transaction to be replaced
 * @returns A zero-value self-transfer TransactionRequest with a higher max fee/gas price
 */
export function getCancelTransaction(oldTx: TransactionResponse): TransactionRequest {
  const newTx: TransactionRequest = {
    from: oldTx.from,
    to: oldTx.from,
    value: BigNumber.from(0),
    gasLimit: oldTx.gasLimit,
    nonce: oldTx.nonce,
  };
  return setFeeForReplacement(oldTx, newTx);
}
