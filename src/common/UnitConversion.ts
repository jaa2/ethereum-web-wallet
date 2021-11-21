import { Provider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';

/**
   * Returns the USD amount of 1 ETH as a number
   */
export default async function currentETHtoUSD(amount: number = 1, provider: Provider):
Promise<number> {
  let contractAddr: string | null = null;
  switch ((await provider.getNetwork()).chainId) {
    case 1:
      contractAddr = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
      break;
    case 3:
      contractAddr = '0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507';
      break;
    default:
      break;
  }

  if (contractAddr === null) {
    // This network is not supported
    return 0;
  }

  const abi = ['function latestAnswer() public view returns (int256)'];
  const chainlinkETHUSDFeed = new Contract(contractAddr, abi, provider);
  try {
    const priceInUSD = (BigNumber.from(await chainlinkETHUSDFeed.latestAnswer()).toNumber()
        / 10 ** 8) * amount;
    return priceInUSD;
  } catch (e) {
    return 0;
  }
}
