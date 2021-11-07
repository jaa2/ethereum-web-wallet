import { defaultAbiCoder, Interface } from "@ethersproject/abi";
import { Provider } from "@ethersproject/abstract-provider";
import { getAddress, getContractAddress, isAddress } from "@ethersproject/address";
import { hexDataSlice } from "@ethersproject/bytes";
import { Transaction } from "@ethersproject/transactions";
import { Wallet } from "@ethersproject/wallet";
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

// Source: https://ethereum.stackexchange.com/questions/11144/how-to-decode-input-data-from-a-transaction
    // To decode transaction data

declare const WEI_TO_GWEI = 0.000000001
declare const GWEI_TO_ETH = 0.000000001;

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
        } catch {
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
        } catch {
            res = false;
        };

        return res;
    }

    /**
     * Returns true if the transaction's gas limit is at least the estimated gas limit
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isGasLimitEnough(t: Transaction): Promise<Boolean> {
        var estimatedGas = await this.provider.estimateGas({to: t.to, data: t.data, value: t.value});
        if (estimatedGas.gt(t.gasLimit)) {
            return false;
        }

        return true;
    }

    /**
     * Returns true if the transaction's gas price is not too high or too low
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isGasPriceReasonable(t: Transaction): Promise<Boolean> {
        if (t === null || t === undefined) {
            return false;
        }

        var feeData = await this.provider.getFeeData();
        var type = t.type;
        if (type === null) {
            return false;
        }

        if (type === 2) {
            var maxPriorityFeePerGas = t.maxPriorityFeePerGas;
            var maxFeePerGas = t.maxFeePerGas;
            if (maxFeePerGas === undefined || maxPriorityFeePerGas === undefined) {
                return false;
            }

            var estMaxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
            var estMaxFeePerGas = feeData.maxFeePerGas;
            if (estMaxPriorityFeePerGas === null || estMaxFeePerGas === null) {
                return false;
            }

            if (maxPriorityFeePerGas.gte(estMaxPriorityFeePerGas) && maxPriorityFeePerGas.lte(estMaxPriorityFeePerGas.mul(2)) 
                && maxFeePerGas.gte(estMaxFeePerGas.mul(1.1)) && maxFeePerGas.lte(estMaxFeePerGas.mul(3))) {
                    return true;
            } else {
                return false;
            }
        } else {
            var tGasPrice = t.gasPrice;
            var estGasPrice = feeData.gasPrice;
            if (tGasPrice === undefined || estGasPrice === null) {
                return false;
            }

            var estGasPrice50 = estGasPrice.mul(0.5);

            if (estGasPrice.sub(estGasPrice50).gte(tGasPrice) || estGasPrice.add(estGasPrice50).lte(tGasPrice)) {
                return false;
            } else {
                return true;
            }
        }
    }

    // NOTE: Can be done on create transaction page rather than here (before user simulates)
    /**
     * Returns true if the transaction has an empty data fields
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    // async hasEmptyDataFields(t: Transaction): Promise<Boolean> {
    //     var dest = t.to as string;
    //     var amount = t.value;
    //     var gasPrice = t.gasPrice;

    //     if (dest === "" || amount === null || gasPrice === null) {
    //         return true;
    //     }

    //     return false;
    // }

    // NOTE: All networks have different address spaces but of the same capacity
    /**
     * Returns true if the destination address is valid
     * @param t Transaction to test
     * @returns true if the transcation matches the function description
     */
    async isAddressValid(t: Transaction, w: Wallet): Promise<Boolean> {
        try {
            // Returns the checksum address, or we can just the simple isAddress()
            var dest = getAddress(t.to as string);
            // TODO: check that address is something you can interact with and that user is not just sending to a void
                // Something I need to take more time to research into

            // Can do additional address checks if needed
        } catch {
            return false;
        };

        return true;
    }

    // TODO: Need address book or list of recent addresses to complete this
    /**
     * Returns true if the transaction is sent to an address it has not been sent to before
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isNewAddress(t: Transaction): Promise<Boolean> {
        return false;
    }

    // NOTE: Need to get wallet balance without using await this.provider.getBalance(await w.getAddress()) for every simulation call
    /**
     * Returns true if the total amount of the transaction is more than what is in the user's wallet
     * @param t Transaction to test
     * @returns true if the transaction matches the function description
     */
    async isTotalMoreThanWallet(t: Transaction, w: Wallet, balance: BigNumber): Promise<Boolean> {
        var tGasPrice = t.gasPrice;
        var tGasLimit = t.gasLimit;
        if ((tGasPrice === null || tGasPrice === undefined) || (tGasLimit === null || tGasLimit === undefined)) {
            return false;
        }

        var tGasTotalFees = tGasPrice.mul(tGasLimit).mul(WEI_TO_GWEI).mul(GWEI_TO_ETH);

        var amount = t.value;
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