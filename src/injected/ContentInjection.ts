import { InjectedProvider, OurInjectedProvider } from './InjectedProvider';

interface ContentWindowInterface {
  ethereum: InjectedProvider;
}

declare global {
  interface Window extends ContentWindowInterface {
  }
}

// Inject into window.ethereum
window.ethereum = new OurInjectedProvider();
