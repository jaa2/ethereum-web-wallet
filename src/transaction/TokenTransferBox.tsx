import { TransactionRequest } from '@ethersproject/abstract-provider';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import React from 'react';
import { getTransferLogs, TokenTransfer } from './LogTracer';

export interface TokenTransferBox {
  state: {
    tokenTransfers: Array<TokenTransfer>;
    tx: TransactionRequest;
  }
}

export class TokenTransferBox extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      tokenTransfers: Array<TokenTransfer>(),
      tx: {
        from: '0xd67e28a63cfa5381d3d346d905e2f1a6471bde11',
        to: '0xe592427a0aece92de3edee1f18e0157c05861564',
        data: '0x414bf389000000000000000000000000b4fbf271143f4fbf7b91a5ded31805e42b2208d60000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000d67e28a63cfa5381d3d346d905e2f1a6471bde11000000000000000000000000000000000000000000000000000000016191490900000000000000000000000000000000000000000000000000038d7ea4c680000000000000000000000000000000000000000000000000000002fa215d28153b0000000000000000000000000000000000000000000000000000000000000000',
        value: '0x38d7ea4c68000',
      },
    };
    this.load();
  }

  async load() {
    const { tx } = this.state;
    console.log("this tx", tx); // eslint-disable-line
    const transfers: Array<TokenTransfer> = await getTransferLogs(new JsonRpcProvider(undefined, 'goerli'), tx);
    this.setState({
      tokenTransfers: transfers,
    });
  }

  render() {
    const tokenTransferArray: Array<JSX.Element> = [];
    const { tokenTransfers } = this.state;
    for (let i = 0; i < tokenTransfers.length; i += 1) {
      const tokenTransfer = tokenTransfers[i];
      tokenTransferArray.push(
        <p>
          Transfer from
          {' '}
          {tokenTransfer.from}
          {' '}
          to
          {' '}
          {tokenTransfer.to}
          {' '}
          for
          {' '}
          <b>{ethers.utils.formatEther(tokenTransfer.amount)}</b>
          {' '}
          of token
          {' '}
          {tokenTransfer.token}
        </p>,
      );
    }
    return (
      <div>
        {tokenTransferArray}
      </div>
    );
  }
}
