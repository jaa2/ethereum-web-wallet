import {
  BlockTag, EtherscanProvider, TransactionRequest,
} from '@ethersproject/providers';
import { Deferrable } from 'ethers/lib/utils';
import browser from 'webextension-polyfill';
import { RequestArguments } from '../src/injected/InjectedProvider';

function handleRequest(args: RequestArguments, sender?: browser.Runtime.MessageSender):
Promise<any> {
  switch (args.method) {
    case 'eth_requestAccounts':
      // TODO: Allow user to consent to this operation first
      return window.stateObj.walletState.getWalletSafe()
        .then((signer) => ((signer === null) ? Promise.reject(new Error('wallet not available')) : signer))
        .then((signer) => signer.getAddress())
        .then((address) => [address]);
    case 'eth_chainId':
      if (window.stateObj.provider !== null) {
        return window.stateObj.provider.getNetwork()
          .then((network) => network.chainId);
      }
      // TODO: Throw exception
      break;
    case 'eth_call':
      if (window.stateObj.provider !== null) {
        const params = args.params as [transaction: Deferrable<TransactionRequest>,
          blockTag?: BlockTag | Promise<BlockTag> | undefined];
        if (window.stateObj.provider instanceof EtherscanProvider) {
          // Strip the BlockTag argument, as Etherscan doesn't support it
          if (params.length > 1) {
            params.pop();
          }
        }
        return window.stateObj.provider.call(...params);
      }
      break;
    case 'eth_accounts':
      // TODO: Enforce consent as outlined above
      return handleRequest({
        method: 'eth_requestAccounts',
      });
    case 'eth_blockNumber':
      if (window.stateObj.provider !== null) {
        return window.stateObj.provider.getBlockNumber();
      }
      break;
    case 'net_version':
      if (window.stateObj.provider !== null) {
        return (window.stateObj.provider.getNetwork()).then((network) => network.chainId);
      }
      break;
    case 'eth_sendTransaction':
    {
      console.log(`CreateTransaction runtime url: ${
        browser.runtime.getURL('index.html/#/CreateTransaction')}`);
      const createTabProps: browser.Tabs.CreateCreatePropertiesType = {
        url: browser.runtime.getURL('index.html/#/CreateTransaction'),
      };
      if (sender !== undefined) {
        createTabProps.openerTabId = sender.tab?.id;
      }
      return browser.tabs.create(createTabProps).then((tab) => {
        if (tab.id !== undefined) {
          console.log('Sending message with these params:', args.params);
          // TODO: Clean up old listeners if the create transaction page closes.

          // Create random ID; TODO: Consider UUID/other approach
          const reqId = Math.floor(Math.random() * 1e10);
          const messageListener = function messageListener(ev: MessageEvent<any>) {
            if (!('type' in ev) || ev.type !== 'populateCreateTransactionRequest') {
              console.log('Dumping request:', ev);
              return undefined;
            }
            console.log('Background got message:', ev);
            browser.runtime.onMessage.removeListener(messageListener);
            return Promise.resolve({
              args: args.params,
              originRequestId: reqId,
            });
          };
          browser.runtime.onMessage.addListener(messageListener);

          const retPromise = new Promise((resolve) => {
            const responseListener = function responseListener(ev: MessageEvent<any>) {
              if (!('type' in ev) || ev.type !== 'sendTransactionResponse') {
                return undefined;
              }
              if (!('originRequestId' in ev.data) || ev.data.originRequestId !== reqId) {
                return undefined;
              }
              resolve(ev.data.hash);
              browser.runtime.onMessage.removeListener(responseListener);
              return Promise.resolve();
            };
            browser.runtime.onMessage.addListener(responseListener);
          });
          console.log(`Opened tab ID: ${tab.id}`);
          return retPromise;
        }
        return Promise.reject(new Error('Failed to open new tab'));
      });
    }
    case 'eth_getTransactionByHash':
      if (args.params instanceof Array && typeof (args.params[0]) === 'string') {
        console.log('Should be going...');
        const res = window.stateObj.provider?.getTransaction(args.params[0]);
        if (res !== undefined) {
          return res;
        }
      }
      break;
    case 'eth_getTransactionReceipt':
      if (window.stateObj.provider !== null && args.params instanceof Array && typeof args.params[0] === 'string') {
        return window.stateObj.provider.getTransactionReceipt(args.params[0]);
      }
      break;
    default:
      break;
  }
  console.log('InjectedProviderReceiver: Returning default resolve for ' + args.method); // eslint-disable-line
  return Promise.resolve('0x1');
}

export default function InjectedProviderReceiver(
  message: any,
  _sender: browser.Runtime.MessageSender,
): Promise<any> | void {
  if (!('type' in message)) {
    return;
  }

  if (message.type === 'request') {
    // eslint-disable-next-line consistent-return
    return handleRequest(message.data as RequestArguments, _sender);
  }
}
