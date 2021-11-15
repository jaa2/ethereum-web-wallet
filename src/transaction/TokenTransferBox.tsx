import { TransactionRequest } from '@ethersproject/abstract-provider';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import React from 'react';
import { getTransferLogs, TokenTransfer } from './LogTracer';

interface TokenTransferProps {
  tx: TransactionRequest;
}

export interface TokenTransferBox {
  state: {
    tokenTransfers: Array<TokenTransfer>;
    tx: TransactionRequest;
  },
  props: TokenTransferProps;
}

export class TokenTransferBox extends React.Component<TokenTransferProps> {
  constructor(props: TokenTransferProps) {
    super(props);
    this.state = {
      tokenTransfers: Array<TokenTransfer>(),
      tx: props.tx,
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
