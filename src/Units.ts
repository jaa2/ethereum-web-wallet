import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

/**
 * Computes the log2 of a BigNumber, except that log2(0) = 0 for convenience.
 * @param n BigNumber
 * @returns log2 value as a number
 */
export function log2(n: BigNumber): number {
  let logVal = 0;
  let v = n;
  while (v.gt(1)) {
    logVal += 1;
    v = v.div(2);
  }
  return logVal;
}

/**
 * Computes the base-10 logarithm of a BigNumber, except that log10(0) = 0 for convenience.
 * @param n BigNumber
 * @returns log10 value as a number
 */
export function log10(n: BigNumber): number {
  let logVal = 0;
  let v = n;
  while (v.gt(9)) {
    logVal += 1;
    v = v.div(10);
  }
  return logVal;
}

/**
 * Format a cost, truncating decimal places if necessary
 * @param cost BigNumber to format
 * @param minSigFigs minimum number of significant figures to have in the output
 * @param maxTruncatedDecimals maximum number of decimal places to truncate
 * @returns
 */
export function formatETHCost(cost: BigNumber, minSigFigs: number = 8, maxTruncatedDecimals = 13) {
  const logCost = log10(cost);
  let adjustedCost = cost;
  if (logCost > minSigFigs) {
    let extraFigures = logCost - minSigFigs;
    if (extraFigures > maxTruncatedDecimals) {
      extraFigures = maxTruncatedDecimals;
    }
    const extraFiguresValue = BigNumber.from(10).pow(extraFigures);
    adjustedCost = cost.div(extraFiguresValue).mul(extraFiguresValue);
  }
  return formatEther(adjustedCost);
}
