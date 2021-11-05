import { Provider } from "@ethersproject/abstract-provider";
import { Transaction } from "@ethersproject/transactions";

export class SimulationSuite {
    provider: Provider;

    /**
     * SimulationSuite constructor
     * @param provider Provider to make calls with
     */
    constructor(provider: Provider) {
        this.provider = provider;
    }

    /**
     * Returns whether a transaction is a token transfer to a contract address
     * See https://github.com/ethers-io/ethers.js/issues/423 for decoding tx data
     * See https://ethereum.org/en/developers/docs/standards/tokens/erc-20/#methods
     *  for the ERC-20 ABI
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isTokenTransferToContract(t: Transaction): Promise<Boolean> {
        return false;
    }

    /**
     * Returns whether a transaction has data but is sent to an EOA (non-contract)
     * address
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isDataSentToEOA(t: Transaction): Promise<Boolean> {
        return false;
    }
}