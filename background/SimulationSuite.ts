import { defaultAbiCoder, Interface } from "@ethersproject/abi";
import { Provider } from "@ethersproject/abstract-provider";
import { getContractAddress } from "@ethersproject/address";
import { hexDataSlice } from "@ethersproject/bytes";
import { Transaction } from "@ethersproject/transactions";
import { ethers } from "ethers";

// Source: https://ethereum.stackexchange.com/questions/11144/how-to-decode-input-data-from-a-transaction
    // To decode transaction data

export class SimulationSuite {
    provider: Provider;
    erc20interface: Interface;

    /**
     * SimulationSuite constructor
     * @param provider Provider to make calls with
     */
    constructor(provider: Provider) {
        this.provider = provider;
        this.erc20interface = new ethers.utils.Interface(require('../erc20abi.json'));
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
        // If destination address is not a contract address, return false
        /** Using getCode() to determine if a contract is associated with the address
         *  Source: https://ethereum.stackexchange.com/questions/83017/how-do-you-know-if-a-contract-is-destroyed
         *  Source: https://docs.ethers.io/v5/api/providers/provider/
        */
        // Checking if transaction is a token transfer and then checking if the destination address is a contract address
        var res = true;
        try {
            var input = await this.erc20interface.parseTransaction({data: t.data});
            var dest = input.args[0];
            var code = await this.provider.getCode(dest);
            if (code === "0x") {
                res = false;
            }
        } catch(e) {
            res = false;
        };

        return res;
    }

    /**
     * Returns whether a transaction has data but is sent to an EOA (non-contract)
     * address
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    // TODO: Needs to be fixed. Depending on the function, it is difficult to determine which parameter is the destination address
    // Using a defaultAbiCoder and using its decoding function requires guessing of the parameter types unless if somehow manually
    // parse out the data and recognize the 42-character address (including 0x). However, we would also need to know the number of 
    // parameters the function in the data takes
    async isDataSentToEOA(t: Transaction): Promise<Boolean> {
        var res = true;
        try {
            var input = await this.erc20interface.parseTransaction({data: t.data});
            var dest = input.args[0];
            var code = await this.provider.getCode(dest);
            if (code !== "0x") {
                res = false;
            }
        } catch(e) {
            console.log(e);
            res = false;
        };

        return res;
    }

    /**
     * Returns true if the transaction's gas price is not too high or too low
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isGasPriceReasonable(t: Transaction): Promise<Boolean> {
        var tGasPrice = t.gasPrice;
        // Both total gas fees measured in ETH
        var tGasTotalFees = (await tGasPrice.mul(t.gasLimit)).mul(0.000000001);
        var estimatedTotalGasFees = (await this.provider.estimateGas(t)).mul(tGasPrice).mul(0.000000001);
        var estimate50 = estimatedTotalGasFees.mul(.5);

        if (estimatedTotalGasFees.sub(estimate50) > tGasTotalFees || estimatedTotalGasFees.add(estimate50) < tGasTotalFees) {
            return false;
        }

        return true;
    }

    /**
     * Returns true if the transaction has an empty data fields
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async hasEmptyDataFields(t: Transaction): Promise<Boolean> {
        var dest = t.to;
        var amount = t.value;
        var gasPrice = t.gasPrice;

        if (dest === "" || amount === null || gasPrice === null) {
            return true;
        }

        return false;
    }

    /**
     * Returns true if the transaction is being sent on the right network
     * @param t Transaction to test
     * @returns true if the transcation matches the function description
     */
    async isOnRightNetwork(t: Transaction): Promise<Boolean> {
        return true;
    }

    /**
     * Returns true if the transaction is sent to an address it has not been sent to before
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isNewAddress(t: Transaction): Promise<Boolean> {
        return false;
    }

    /**
     * Returns true if the total amount of the transaction is more than what is in the user's wallet
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isTotalMoreThanWallet(t: Transaction): Promise<Boolean> {
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