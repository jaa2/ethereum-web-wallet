import { EtherscanProvider, Provider } from "@ethersproject/providers";
import { WalletState } from "./WalletState";
import browser from "webextension-polyfill";
import { WalletStorage } from "./WalletStorage";

export interface BackgroundWindowInterface {
    stateObj: {
        walletState: WalletState,
        provider: Provider|null
    };
    generateWallet: () => Promise<void>;
}

declare global {
    interface Window extends BackgroundWindowInterface {
    }
}

window.stateObj = {
    walletState: new WalletState((browser.storage.local as WalletStorage)),
    provider: null
};

window.stateObj.walletState.loadEncrypted()
.catch((reason: string) => {
    console.log("[Background] Could not load encrypted: " + reason)
});
window.stateObj.provider = new EtherscanProvider("ropsten");