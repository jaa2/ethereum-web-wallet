import { BlockTag, EtherscanProvider, TransactionRequest } from '@ethersproject/providers';
import { Deferrable } from 'ethers/lib/utils';
import { RequestArguments } from '../src/injected/InjectedProvider';

function handleRequest(args: RequestArguments): Promise<any> {
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
    default:
      break;
  }
  console.log('InjectedProviderReceiver: Returning default resolve for ' + args.method); // eslint-disable-line
  return Promise.resolve('0x1');
}

export default function InjectedProviderReceiver(
  message: any, // _sender: browser.Runtime.MessageSender,
): Promise<any> | void {
  if (!('type' in message)) {
    return;
  }

  if (message.type === 'request') {
    // eslint-disable-next-line consistent-return
    return handleRequest(message.data as RequestArguments);
  }
}
