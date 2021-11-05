import { Wallet } from "ethers";
import { EtherscanProvider } from "@ethersproject/providers";

declare global {
    interface Window {
        stateObj: any;
        generateWallet: () => Promise<void>;
    }
}

window.stateObj = {
    wallet: null,
    provider: null
};

window.stateObj.provider = new EtherscanProvider("ropsten");

window.generateWallet = async () => {
    window.stateObj.wallet = Wallet.createRandom();
    // Connect wallet to provider
    window.stateObj.wallet = window.stateObj.wallet.connect(window.stateObj.provider);
};