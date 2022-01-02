import { EventEmitter } from 'events';

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export interface InjectedProvider {
  isConnected(): boolean;
  request(args: RequestArguments): Promise<unknown>;
}

export class OurInjectedProvider extends EventEmitter implements InjectedProvider {
  connected: boolean = false;

  lastReqId: number = 0;

  isConnected(): boolean {
    return this !== null;
  }

  request(args: RequestArguments): Promise<unknown> {
    // Assemble request to background script
    const reqId = this.lastReqId;
    this.lastReqId += 1;
    window.postMessage({
      from: 'EthereumWebWallet',
      type: 'request',
      id: reqId,
      data: args,
    }, '*');

    console.log('Untrusted window sending in request:', JSON.stringify(args)); // eslint-disable-line

    // Return a Promise that resolves when a response is received
    return new Promise((resolve) => {
      const responseListener = function responseListener(this: Window, ev: MessageEvent<any>): any {
        if (ev.data.from === 'EthereumWebWalletResponse') {
          if (ev.data.id === reqId) {
            resolve(ev.data.response);
          }
        }
      };
      window.addEventListener('message', responseListener);
    });
  }

  // Deprecated compatibility measures
  enable(): Promise<any> {
    return this.request({
      method: 'eth_requestAccounts',
    });
  }

  send(method: string, params?: Array<unknown>): Promise<any> {
    return this.request({
      method,
      params,
    });
  }
}
