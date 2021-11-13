import { EtherscanProvider, TransactionRequest } from '@ethersproject/providers';
import {
  BytesLike, Contract, ethers, Transaction, Wallet,
} from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import SimulationSuite from './SimulationSuite';

const provider = new EtherscanProvider('ropsten', 'AZ8GS7UXX1A8MZX9ZH2Q1K3H9DPZXB2F68');
const simulationSuite = new SimulationSuite(provider);

function requestToTransaction(txRequest: TransactionRequest) {
  try {
    if (txRequest.chainId !== undefined && txRequest.nonce !== undefined
        && txRequest.data !== undefined) {
      const t: Transaction = {
        to: txRequest.to,
        from: txRequest.from,
        nonce: +(txRequest.nonce?.toString()),
        gasLimit: BigNumber.from(txRequest.gasLimit),
        gasPrice: BigNumber.from(txRequest.gasPrice),
        maxFeePerGas: BigNumber.from(txRequest.maxFeePerGas),
        maxPriorityFeePerGas: BigNumber.from(txRequest.maxPriorityFeePerGas),
        data: txRequest.data?.toString(),
        value: BigNumber.from(txRequest.value),
        chainId: +(txRequest.chainId?.toString()),
      };

      return t;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Returns the USD amount of 1 ETH
 */
async function currentETHtoUSD() {
  const abi = ['function latestAnswer() public view returns (int256)'];
  const chainlinkETHUSDFeed = new Contract('0x0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    abi, provider);
  // Doing a reconversion back into ETH because we want only a specific number of decimal places
  const priceInUSDinWei = ethers.utils.parseUnits(BigNumber.from(await chainlinkETHUSDFeed.latestAnswer()).toString(), 'wei');
  const priceInUSD = BigNumber.from(ethers.utils.formatUnits(priceInUSDinWei, 8));
  return priceInUSD;
}

/**
 * Returns the network's current maxFeePerGas, maxPriorirtyFeePerGas, and gasPrice
 */
async function currentFees() {
  const feeData = await provider.getFeeData();
  const { maxFeePerGas } = feeData;
  const { maxPriorityFeePerGas } = feeData;
  const { gasPrice } = feeData;
  return [maxFeePerGas, maxPriorityFeePerGas, gasPrice];
}

// Source:
// https://ethereum.stackexchange.com/questions/80617/how-can-i-know-a-hash-mined-and-confirmed-by-ethers-js
/**
 *
 * @param t
 */
async function isTransactionMined(t: Transaction) {
  const transactionReceipt = await provider.getTransactionReceipt(t.hash as string);
  if (transactionReceipt !== null && transactionReceipt.blockNumber !== null) {
    return true;
  }

  return false;
}

/**
 * Calculates the gas limit in ETH
 * @param t Transaction
 * @returns the gas limit in ETH as a string
 */
function gasLimitInETH(t: Transaction) {
  const tGasLimit = t.gasLimit;
  const gasLimitEth = ethers.utils.formatEther(tGasLimit);
  return gasLimitEth;
}

/**
 * Calculates the total transaction fee in ETH
 * @param t Transaction
 * @returns the total transaction fee in ETH as a string
 */
function totalTransactionFeeInETH(t: Transaction) {
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
async function simulateTransaction(to: string, from: string, amount: number,
  data: BytesLike, wallet: Wallet) {
  const tx = await wallet.populateTransaction({ to, from, value: amount });
  const t = requestToTransaction(tx);
  if (t === null) {
    return null;
  }
  // Our Simulation Checks
  const isGasLimitEnough = await simulationSuite.isGasLimitEnough(t);
  const isGasPriceReasonable = await simulationSuite.isGasPriceReasonable(t);
  const isAddressValid = await SimulationSuite.isAddressValid(t);
  const moreThanWallet = await SimulationSuite.isTotalMoreThanWallet(t, await wallet.getBalance());
  let isDataSentCorrectly;

  const code = await provider.getCode(t.to as string);
  if (data !== '0x' && code === '0x') {
    isDataSentCorrectly = await simulationSuite.isDataSentToEOA(t);
  } else if (data !== '0x' && code !== '0x') {
    isDataSentCorrectly = await simulationSuite.isTokenTransferToContract(t);
  } else {
    isDataSentCorrectly = true;
  }

  // Simulation Check = Key; Boolean = Value
  const passedChecks = new Map([
    ['Gas Limit is Reasonable', isGasLimitEnough],
    ['Gas Price is Reasonable', isGasPriceReasonable],
    ['Address is Valid', isAddressValid],
    ['Total is more than Wallet', moreThanWallet],
    ['Data is sent correctly', isDataSentCorrectly]]);

  return passedChecks;
}

/**
 * Sends a transaction
 * @param t Transaction to send
 * @returns the transaction hash and the promise from sending t
 */
async function sendTransaction(t: Transaction) {
  const tHash = t.hash as string;
  const response = await provider.sendTransaction(tHash);
  return [tHash, response];
}
